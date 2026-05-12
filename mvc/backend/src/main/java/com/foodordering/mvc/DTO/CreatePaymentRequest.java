package com.foodordering.mvc.DTO;

import lombok.Data;

@Data
public class CreatePaymentRequest {
    private String orderId;
    private String paymentMethod; // CASH, VISA, INSTAPAY
}