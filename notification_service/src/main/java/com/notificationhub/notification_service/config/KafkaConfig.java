package com.notificationhub.notification_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.util.backoff.FixedBackOff;

@Configuration
public class KafkaConfig {

    @Bean
    public DefaultErrorHandler errorHandler(KafkaTemplate<Object, Object> template) {
        // Publish to DLT (adds ".DLT" suffix to the original topic name)
        DeadLetterPublishingRecoverer recoverer = new DeadLetterPublishingRecoverer(template);
        
        // Attempt 1 retry with a 1-second delay before sending to DLQ
        FixedBackOff backOff = new FixedBackOff(1000L, 1L);
        
        return new DefaultErrorHandler(recoverer, backOff);
    }
}
