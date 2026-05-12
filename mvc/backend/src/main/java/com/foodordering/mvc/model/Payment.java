package com.foodordering.mvc.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    private String id;

    private String orderId;          // reference to Order
    private String paymentMethod;    // CASH, VISA, INSTAPAY
    private String paymentStatus;    // PENDING, COMPLETED, FAILED
    private double totalAmount;      // taken directly from Order.totalPrice
    private LocalDateTime transactionDate;

    public enum PaymentStatus {
        PENDING,
        COMPLETED,
        FAILED
    }
}