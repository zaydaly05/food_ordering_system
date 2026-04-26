package com.foodordering.users.model;

public class Customer implements UserAccount {
    private final String id;
    private final String name;
    private final String email;
    private String address;
    private int loyaltyPoints;

    public Customer(String id, String name, String email, String address, int loyaltyPoints) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.address = address;
        this.loyaltyPoints = loyaltyPoints;
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
        return UserRole.CUSTOMER;
    }

    public String getAddress() {
        return address;
    }

    public int getLoyaltyPoints() {
        return loyaltyPoints;
    }

    public void updateAddress(String newAddress) {
        this.address = newAddress;
    }

    public void addLoyaltyPoints(int points) {
        this.loyaltyPoints += points;
    }
}
