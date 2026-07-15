package com.notificationhub.notification_service.repository;

import com.notificationhub.notification_service.model.NotificationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationLogRepository extends JpaRepository<NotificationLog, Long> {

    @Query("SELECT n FROM NotificationLog n WHERE " +
           "(:keyword IS NULL OR LOWER(n.recipient) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(n.eventId) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:status IS NULL OR LOWER(n.status) = LOWER(:status)) AND " +
           "(:channel IS NULL OR LOWER(n.channel) = LOWER(:channel)) " +
           "ORDER BY n.timestamp DESC")
    List<NotificationLog> searchLogs(
            @Param("keyword") String keyword,
            @Param("status") String status,
            @Param("channel") String channel
    );
}
