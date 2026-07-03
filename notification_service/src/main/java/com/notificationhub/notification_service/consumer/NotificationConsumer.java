package com.notificationhub.notification_service.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class NotificationConsumer {

    @KafkaListener(
            topics = "notification-hub-topic",
            groupId = "notification-hub-group"
    )
    public void consumeNotificationEvent(String messagePayload) {
        try {
            System.out.println("\n==================================================");
            System.out.println("📥 [KAFKA CONSUMER] Real-time Message Stream Ingested!");
            System.out.println("Payload Content: " + messagePayload);
            System.out.println("==================================================\n");

            //  We will parse this JSON payload and hook it into our Redis cache layer!

        } catch (Exception e) {
            System.err.println("Error processing incoming Kafka message streaming: " + e.getMessage());
        }
    }
}