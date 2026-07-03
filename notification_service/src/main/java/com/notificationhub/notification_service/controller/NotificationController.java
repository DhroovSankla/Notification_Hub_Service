package com.notificationhub.notification_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    // A protected route that requires authentication
    @GetMapping("/secure-test")
    public ResponseEntity<String> getSecureData() {
        // Retrieve the username extracted by our JwtAuthenticationFilter from the security context
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        return ResponseEntity.ok(String.format(
                "Access Granted! Hello %s. Your stateless JWT security gate is working flawlessly!",
                currentUsername
        ));
    }
}