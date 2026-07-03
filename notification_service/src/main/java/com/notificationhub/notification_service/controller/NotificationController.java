package com.notificationhub.notification_service.controller;

import com.notificationhub.notification_service.model.NotificationEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private RedisTemplate<String, NotificationEvent> redisTemplate;

    @GetMapping("/secure-test")
    public ResponseEntity<String> getSecureData() {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(String.format(
                "Access Granted! Hello %s. Your stateless JWT security gate is working flawlessly!",
                currentUsername
        ));
    }

    // Added: Protected endpoint that pulls real-time payloads straight out of the Redis cache tier
    @GetMapping("/cached/{eventId}")
    public ResponseEntity<?> getCachedNotification(@PathVariable String eventId) {
        String redisKey = "notification:" + eventId;

        // Interrogate the Redis cluster data layer
        NotificationEvent cachedEvent = redisTemplate.opsForValue().get(redisKey);

        if (cachedEvent == null) {
            return ResponseEntity.status(404).body("Notification event not found or has expired from the cache tier.");
        }

        return ResponseEntity.ok(cachedEvent);
    }
}