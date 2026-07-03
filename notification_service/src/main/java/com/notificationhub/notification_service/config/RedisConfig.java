package com.notificationhub.notification_service.config;

import com.notificationhub.notification_service.model.NotificationEvent;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, NotificationEvent> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, NotificationEvent> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        // Map keys as standard plain text strings
        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());

        // Automatically serialize our NotificationEvent entities directly into JSON format strings
        Jackson2JsonRedisSerializer<NotificationEvent> jsonSerializer = new Jackson2JsonRedisSerializer<>(NotificationEvent.class);
        template.setValueSerializer(jsonSerializer);
        template.setHashValueSerializer(jsonSerializer);

        return template;
    }
}