package com.foodordering.mvc.factory;

import com.foodordering.mvc.model.Customer;

public class CustomerFactory implements UserFactory<Customer> {
    private final String id;
    private final String name;
    private final String email;
    private final String address;

    public CustomerFactory(String id, String name, String email, String address) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.address = address;
    }

    @Override
    public Customer create() {
        return new Customer(id, name, email, address, 0);
    }
}

