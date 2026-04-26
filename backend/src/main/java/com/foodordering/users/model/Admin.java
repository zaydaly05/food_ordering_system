package com.foodordering.users.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Admin implements UserAccount {
    private final String id;
    private final String name;
    private final String email;
    private final List<String> permissions;

    public Admin(String id, String name, String email, List<String> permissions) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.permissions = new ArrayList<>(permissions);
    }

    @Override
    public String getId() {
        return id;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public String getEmail() {
        return email;
    }

    @Override
    public UserRole getRole() {
        return UserRole.ADMIN;
    }

    public List<String> getPermissions() {
        return Collections.unmodifiableList(permissions);
    }

    public boolean canManage(String permission) {
        return permissions.contains(permission);
    }
}
