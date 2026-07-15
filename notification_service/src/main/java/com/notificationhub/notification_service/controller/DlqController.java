package com.notificationhub.notification_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dlq")
@CrossOrigin("*")
public class DlqController {

    private final List<String> trappedEvents = new ArrayList<>();

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private com.notificationhub.notification_service.repository.NotificationLogRepository logRepository;

    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();

    @KafkaListener(topics = "notification-hub-topic.DLT", groupId = "notification-hub-dlq-group")
    public void consumeDlqEvent(String messagePayload) {
        System.out.println("⚠️ DLQ INTERCEPTED MESSAGE: " + messagePayload);
        synchronized (trappedEvents) {
            trappedEvents.add(messagePayload);
        }
    }

    @GetMapping("/events")
    public ResponseEntity<List<String>> getTrappedEvents() {
        synchronized (trappedEvents) {
            return ResponseEntity.ok(new ArrayList<>(trappedEvents));
        }
    }

    @PostMapping("/replay")
    public ResponseEntity<?> replayEvents() {
        int count = 0;
        synchronized (trappedEvents) {
            for (String payload : trappedEvents) {
                try {
                    com.notificationhub.notification_service.model.NotificationEvent event = 
                        objectMapper.readValue(payload, com.notificationhub.notification_service.model.NotificationEvent.class);
                    
                    // Compile the template
                    com.notificationhub.notification_service.util.TemplateEngine.CompiledTemplate ct = 
                        com.notificationhub.notification_service.util.TemplateEngine.compile(
                            event.getTemplateType(), event.getStudentName(), event.getRecipient(), event.getRollNumber(), event.getDepartment()
                        );
                    event.setMessageSubject(ct.subject);
                    event.setMessageBody(ct.body);

                    // Log replay action to H2 Audit Trail
                    logRepository.save(new com.notificationhub.notification_service.model.NotificationLog(
                        event.getEventId(), event.getRecipient(), event.getChannel(), event.getTemplateType(), "REPLAYED_FROM_DLQ", objectMapper.writeValueAsString(event)
                    ));
                } catch (Exception e) {
                    System.err.println("⚠️ Failed to parse replayed payload for audit: " + e.getMessage());
                }

                kafkaTemplate.send("notification-hub-topic", payload);
                count++;
            }
            trappedEvents.clear();
        }
        System.out.println("♻️ REPLAYED " + count + " MESSAGES FROM DLQ");
        return ResponseEntity.ok(Map.of("message", "Replayed " + count + " events", "count", count));
    }
}
