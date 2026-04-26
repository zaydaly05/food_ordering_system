package com.foodordering.users.model;

public interface UserAccount {
    String getId();

    String getName();

    String getEmail();

    UserRole getRole();
}
