package com.foodordering.mvc.view;

public class VipCustomerViewDecorator extends CustomerViewDecorator {
    public VipCustomerViewDecorator(CustomerView wrappedView) {
        super(wrappedView);
    }

    @Override
    public String profileSummary() {
        return super.profileSummary() + " [VIP Customer]";
    }
}

