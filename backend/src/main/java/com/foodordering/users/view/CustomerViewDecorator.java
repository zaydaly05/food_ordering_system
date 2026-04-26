package com.foodordering.users.view;

public abstract class CustomerViewDecorator implements CustomerView {
    private final CustomerView wrappedView;

    protected CustomerViewDecorator(CustomerView wrappedView) {
        this.wrappedView = wrappedView;
    }

    @Override
    public String profileSummary() {
        return wrappedView.profileSummary();
    }
}
