package com.foodordering.mvc.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "deliveries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Delivery {

    @Id
    private String id;

    private String orderId;               // reference to Order
    private String deliveryPersonName;
    private String deliveryPhone;
    private String deliveryAddress;
    private String estimatedDeliveryTime; // e.g. "30-45 minutes"
    private String deliveryStatus;        // PENDING, OUT_FOR_DELIVERY, DELIVERED
    private LocalDateTime createdAt;

    public enum DeliveryStatus {
        PENDING,
        OUT_FOR_DELIVERY,
        DELIVERED
    }
}