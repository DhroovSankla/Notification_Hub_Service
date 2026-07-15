package com.notificationhub.notification_service.config;

import com.notificationhub.notification_service.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        http

                //  Enable CORS using our custom configuration source below
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Disable CSRF because JWT-based tokens are state-independent and immune to CSRF exploits
                .csrf(AbstractHttpConfigurer::disable)

                // Turn off basic stateful session recording inside the server memory layer
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                 // Set access permissions criteria mapping rules
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll() // Allow preflight CORS
                        .requestMatchers("/api/auth/**").permitAll() // Allow public login/register routes without tokens
                        .requestMatchers("/ws-notifications/**").permitAll() // Allow WebSockets
                        .requestMatchers("/h2-console/**").permitAll() // Allow H2 database console access
                        .requestMatchers("/api/simulation/**", "/api/dlq/**", "/api/audit/**").hasAuthority("ROLE_ADMIN")
                        .anyRequest().authenticated()               // All other endpoints require a valid token signature
                )
                // Disable frameOptions so that H2 console frames can load in browser
                .headers(headers -> headers.frameOptions(frame -> frame.disable()));

        // Inject our custom JWT validation handler *before* the traditional username/password filter runs
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173")); // Front-end Vite port
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Cache-Control", "Pragma", "Accept", "Origin", "X-Requested-With"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}