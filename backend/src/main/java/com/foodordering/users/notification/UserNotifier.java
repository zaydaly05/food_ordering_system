package com.foodordering.users.notification;

import com.foodordering.users.model.UserAccount;

public class UserNotifier {
    private NotificationStrategy notificationStrategy;

    public UserNotifier(NotificationStrategy notificationStrategy) {
        this.notificationStrategy = notificationStrategy;
    }

    public void setNotificationStrategy(NotificationStrategy notificationStrategy) {
        this.notificationStrategy = notificationStrategy;
    }

    public String notify(UserAccount user, String message) {
        return notificationStrategy.send(user, message);
    }
}
