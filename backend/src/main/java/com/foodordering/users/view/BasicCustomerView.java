package com.foodordering.users.view;

import com.foodordering.users.model.Customer;

public class BasicCustomerView implements CustomerView {
    private final Customer customer;

    public BasicCustomerView(Customer customer) {
        this.customer = customer;
    }

    @Override
    public String profileSummary() {
        return "Customer: " + customer.getName()
                + ", Address: " + customer.getAddress()
                + ", Points: " + customer.getLoyaltyPoints();
    }
}
