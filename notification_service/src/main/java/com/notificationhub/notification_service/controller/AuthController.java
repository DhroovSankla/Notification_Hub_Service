package com.notificationhub.notification_service.controller;

import com.notificationhub.notification_service.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JwtUtils jwtUtils;

    // Public login endpoint - bypassed by Spring Security filter matching rules
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        if (username == null || username.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username is required"));
        }
        if (password == null || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password is required"));
        }

        // Simple validation rule:
        // admin -> password: admin
        // anyone else -> password: operator
        if ("admin".equalsIgnoreCase(username)) {
            if (!"admin".equals(password)) {
                return ResponseEntity.status(401).body(Map.of("message", "Invalid admin credentials"));
            }
        } else {
            if (!"operator".equals(password)) {
                return ResponseEntity.status(401).body(Map.of("message", "Invalid operator credentials. Standard password is 'operator'."));
            }
        }

        // Generate a cryptographically signed JWT token for the user
        String token = jwtUtils.generateJwtToken(username);

        // Package the token nicely into a JSON response body map
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("type", "Bearer");

        return ResponseEntity.ok(response);
    }

    // Google Sign-In Simulation Endpoint
    @PostMapping("/google-login")
    public ResponseEntity<?> authenticateGoogleUser(@RequestBody Map<String, String> googleRequest) {
        String username = googleRequest.get("username");
        if (username == null || username.trim().isEmpty()) {
            username = "google_operator";
        }

        String token = jwtUtils.generateJwtToken(username);
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("type", "Bearer");
        return ResponseEntity.ok(response);
    }
}