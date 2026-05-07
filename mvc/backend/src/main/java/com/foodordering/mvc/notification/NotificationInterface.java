package com.foodordering.mvc.notification;
import com.foodordering.mvc.DTO.NotificationRequest;

// interface for notification
public interface NotificationInterface {
    void sendNotification(NotificationRequest request);
}
