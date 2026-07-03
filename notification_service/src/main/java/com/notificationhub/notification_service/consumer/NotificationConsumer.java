package com.notificationhub.notification_service.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.notificationhub.notification_service.model.NotificationEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class NotificationConsumer {

    @Autowired
    private RedisTemplate<String, NotificationEvent> redisTemplate;

    // Use Jackson's ObjectMapper to parse the incoming raw JSON string
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(
            topics = "notification-hub-topic",
            groupId = "notification-hub-group"
    )
    public void consumeNotificationEvent(String messagePayload) {
        try {
            System.out.println("\n==================================================");
            System.out.println(" [KAFKA CONSUMER] Message Stream Ingested!");

            // 1. Parse the raw text string into a clean Java Object instance
            NotificationEvent event = objectMapper.readValue(messagePayload, NotificationEvent.class);
            System.out.println("Parsed Event ID: " + event.getEventId());
            System.out.println("Target Recipient: " + event.getRecipient());

            // 2. Compute a deterministic cache key for Redis
            String redisKey = "notification:" + event.getEventId();

            // 3. Cache it in Redis with a Time-To-Live (TTL) of 2 hours to keep data fresh
            redisTemplate.opsForValue().set(redisKey, event, 2, TimeUnit.HOURS);

            System.out.println(" [REDIS CACHE] Event safely cached under key: " + redisKey);
            System.out.println("==================================================\n");

        } catch (Exception e) {
            System.err.println(" Error processing/serializing incoming Kafka stream: " + e.getMessage());
        }
    }
}