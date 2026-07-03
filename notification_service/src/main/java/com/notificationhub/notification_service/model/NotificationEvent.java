package com.notificationhub.notification_service.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEvent {
    private String eventId;
    private String recipient;
    private String channel; // e.g., EMAIL, SMS, PUSH
    private String messageSubject;
    private String messageBody;
}