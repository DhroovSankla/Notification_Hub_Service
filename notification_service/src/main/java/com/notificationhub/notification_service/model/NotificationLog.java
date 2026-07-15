package com.notificationhub.notification_service.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification_audit_log")
public class NotificationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String eventId;

    @Column(nullable = false)
    private String recipient;

    @Column(nullable = false)
    private String channel;

    @Column(nullable = false)
    private String templateType;

    @Column(nullable = false)
    private String status; // PROCESSED, TRAPPED_IN_DLQ, REPLAYED_FROM_DLQ

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Lob
    @Column(length = 2000)
    private String payload;

    public NotificationLog() {}

    public NotificationLog(String eventId, String recipient, String channel, String templateType, String status, String payload) {
        this.eventId = eventId;
        this.recipient = recipient;
        this.channel = channel;
        this.templateType = templateType;
        this.status = status;
        this.payload = payload;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }

    public String getRecipient() { return recipient; }
    public void setRecipient(String recipient) { this.recipient = recipient; }

    public String getChannel() { return channel; }
    public void setChannel(String channel) { this.channel = channel; }

    public String getTemplateType() { return templateType; }
    public void setTemplateType(String templateType) { this.templateType = templateType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getPayload() { return payload; }
    public void setPayload(String payload) { this.payload = payload; }
}
