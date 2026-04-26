package com.foodordering.users.notification;

import com.foodordering.users.model.UserAccount;

public class InAppNotificationStrategy implements NotificationStrategy {
    @Override
    public String send(UserAccount user, String message) {
        return "In-app message for " + user.getName() + ": " + message;
    }
}
