package com.notificationhub.notification_service.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.notificationhub.notification_service.model.NotificationEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@Service
public class NotificationConsumer {

    @Autowired
    private RedisTemplate<String, NotificationEvent> redisTemplate;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Use Jackson's ObjectMapper to parse the incoming raw JSON string
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private com.notificationhub.notification_service.repository.NotificationLogRepository logRepository;

    @Autowired
    private com.notificationhub.notification_service.controller.SimulationController simulationController;

    @Autowired
    private org.springframework.kafka.core.KafkaTemplate<String, String> kafkaTemplate;

    @KafkaListener(
            topics = "notification-hub-topic",
            groupId = "notification-hub-group"
    )
    public void consumeNotificationEvent(String messagePayload) throws Exception {
        // Parse the event first to get recipient, eventId, and template details for audit logs
        NotificationEvent event = null;
        try {
            event = objectMapper.readValue(messagePayload, NotificationEvent.class);
        } catch (Exception e) {
            System.err.println("❌ Failed to parse incoming Kafka payload: " + e.getMessage());
        }

        if (simulationController.isFaultModeActive()) {
            System.out.println("🚨 SIMULATION FAULT TRIGGERED: Rejecting message to Dead Letter Queue (DLQ)!");
            if (event != null) {
                // Compile the template anyway for audit trail readability
                com.notificationhub.notification_service.util.TemplateEngine.CompiledTemplate ct = 
                    com.notificationhub.notification_service.util.TemplateEngine.compile(
                        event.getTemplateType(), event.getStudentName(), event.getRecipient(), event.getRollNumber(), event.getDepartment()
                    );
                event.setMessageSubject(ct.subject);
                event.setMessageBody(ct.body);

                // Log failure to H2 Database Audit Trail
                logRepository.save(new com.notificationhub.notification_service.model.NotificationLog(
                    event.getEventId(), event.getRecipient(), event.getChannel(), event.getTemplateType(), "TRAPPED_IN_DLQ", objectMapper.writeValueAsString(event)
                ));
            }
            kafkaTemplate.send("notification-hub-topic.DLT", messagePayload);
            return; // Skip normal processing
        }

        try {
            System.out.println("\n==================================================");
            System.out.println(" [KAFKA CONSUMER] Message Stream Ingested!");

            if (event == null) return;

            // 1. Compile the notification body dynamically using the Template Engine
            com.notificationhub.notification_service.util.TemplateEngine.CompiledTemplate ct = 
                com.notificationhub.notification_service.util.TemplateEngine.compile(
                    event.getTemplateType(), event.getStudentName(), event.getRecipient(), event.getRollNumber(), event.getDepartment()
                );
            event.setMessageSubject(ct.subject);
            event.setMessageBody(ct.body);

            System.out.println("Parsed Event ID: " + event.getEventId());
            System.out.println("Target Recipient: " + event.getRecipient());
            System.out.println("Compiled Subject: " + event.getMessageSubject());

            // 2. Compute a deterministic cache key for Redis
            String redisKey = "notification:" + event.getEventId();

            // 3. Cache it in Redis with a Time-To-Live (TTL) of 2 hours
            redisTemplate.opsForValue().set(redisKey, event, 2, TimeUnit.HOURS);
            System.out.println(" [REDIS CACHE] Event safely cached under key: " + redisKey);

            // 4. Log Success to H2 Database Audit Trail
            logRepository.save(new com.notificationhub.notification_service.model.NotificationLog(
                event.getEventId(), event.getRecipient(), event.getChannel(), event.getTemplateType(), "PROCESSED", objectMapper.writeValueAsString(event)
            ));

            // 5. Broadcast via WebSockets to the connected UI clients
            messagingTemplate.convertAndSend("/topic/live-events", event);
            System.out.println(" [WEBSOCKET] Event broadcasted to /topic/live-events");

            System.out.println("==================================================\n");
        } catch (Exception e) {
            System.err.println(" Error processing/serializing incoming Kafka stream: " + e.getMessage());
        }
    }
}