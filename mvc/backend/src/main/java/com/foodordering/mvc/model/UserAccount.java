package com.foodordering.mvc.model;

public interface UserAccount {
    String getId();

    String getName();

    String getEmail();

    UserRole getRole();
}

