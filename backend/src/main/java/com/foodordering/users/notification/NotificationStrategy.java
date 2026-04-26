package com.foodordering.users.notification;

import com.foodordering.users.model.UserAccount;

public interface NotificationStrategy {
    String send(UserAccount user, String message);
}
