package com.notificationhub.notification_service.controller;

import com.notificationhub.notification_service.model.NotificationLog;
import com.notificationhub.notification_service.repository.NotificationLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
@CrossOrigin("*")
public class AuditController {

    @Autowired
    private NotificationLogRepository logRepository;

    @GetMapping("/logs")
    public ResponseEntity<List<NotificationLog>> getLogs(
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "channel", required = false) String channel) {

        // Normalize empty strings to null
        String searchKeyword = (query == null || query.trim().isEmpty()) ? null : query.trim();
        String filterStatus = (status == null || status.trim().isEmpty() || "ALL".equalsIgnoreCase(status)) ? null : status.trim();
        String filterChannel = (channel == null || channel.trim().isEmpty() || "ALL".equalsIgnoreCase(channel)) ? null : channel.trim();

        List<NotificationLog> logs = logRepository.searchLogs(searchKeyword, filterStatus, filterChannel);
        return ResponseEntity.ok(logs);
    }
}
