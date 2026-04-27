package com.foodordering.mvc.notification;

import com.foodordering.mvc.model.UserAccount;

public class EmailNotificationStrategy implements NotificationStrategy {
    @Override
    public String send(UserAccount user, String message) {
        return "Email sent to " + user.getEmail() + ": " + message;
    }
}

