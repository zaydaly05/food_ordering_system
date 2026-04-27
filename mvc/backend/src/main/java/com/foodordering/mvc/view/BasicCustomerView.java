package com.foodordering.mvc.view;

import com.foodordering.mvc.model.Customer;

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

