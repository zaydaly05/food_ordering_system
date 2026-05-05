package com.foodordering.mvc.notification;
import com.foodordering.mvc.DTO.NotificationRequest;

public interface NotificationInterface {
    void sendNotification(NotificationRequest request);
}
