package com.foodordering.mvc.DTO;

public class PaymentRequest {

    private String paymentMethod; // CASH or VISA

    public PaymentRequest() {
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}