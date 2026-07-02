package com.notificationhub.notification_service.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtils {

    // Generate a secure 256-bit secret key for cryptographic signing
    private final SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // Token expiration time setup: 24 Hours (in milliseconds)
    private final long jwtExpirationMs = 86400000;

    // Generate a new token for a authenticated user
    public String generateJwtToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(secretKey)
                .compact();
    }

    // Extract the username claim from an active token
    public String getUsernameFromJwtToken(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // Validate token integrity and expiration states
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(authToken);
            return true;
        } catch (Exception e) {
            // Log authentication errors cleanly
            System.err.println("Invalid JWT signature or token expired: " + e.getMessage());
        }
        return false;
    }
}