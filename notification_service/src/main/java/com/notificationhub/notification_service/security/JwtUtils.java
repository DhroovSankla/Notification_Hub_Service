package com.notificationhub.notification_service.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import javax.crypto.SecretKey;
import java.util.Date;
import java.nio.charset.StandardCharsets;

@Component
public class JwtUtils {

    // Inject the static key straight from application.properties
    @Value("${app.jwt.secret}")
    private String jwtSecret;

    // Token expiration time setup: 24 Hours (in milliseconds)
    private final long jwtExpirationMs = 86400000;

    // Convert our configured text string into a production-ready SecretKey object instance
    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Generate a new token for a authenticated user
    public String generateJwtToken(String username) {
        String role = (username.equalsIgnoreCase("admin") || username.toLowerCase().contains("admin")) ? "ROLE_ADMIN" : "ROLE_OPERATOR";
        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    // Extract the username claim from an active token
    public String getUsernameFromJwtToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // Extract the role claim from an active token
    public String getRoleFromJwtToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("role", String.class);
    }

    // Validate token integrity and expiration states
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(authToken);
            return true;
        } catch (Exception e) {
            // Log authentication errors cleanly
            System.err.println("Invalid JWT signature or token expired: " + e.getMessage());
        }
        return false;
    }
}