package com.foodordering.users.factory;

import com.foodordering.users.model.Admin;

import java.util.List;

public class AdminFactory implements UserFactory<Admin> {
    private final String id;
    private final String name;
    private final String email;
    private final List<String> permissions;

    public AdminFactory(String id, String name, String email, List<String> permissions) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.permissions = permissions;
    }

    @Override
    public Admin create() {
        return new Admin(id, name, email, permissions);
    }
}
