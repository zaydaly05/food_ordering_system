package com.foodordering.mvc.notification;

import com.foodordering.mvc.model.UserAccount;

public interface NotificationStrategy {
    String send(UserAccount user, String message);
}

