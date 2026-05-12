package com.foodordering.mvc.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

// order model with order item and order status enum. also includes user details for fetching all orders with user details.
@Document(collection = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    private String id;
    private String userId;
    private String userName;
    private String phone;
    private List<OrderItem> items;
    private double totalPrice;
    private OrderStatus status;
    private String address;
    private LocalDateTime createdAt;


    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItem {
        private String MenuItemId;
        private String name;
        private int quantity;
        private double price;
    }


    
    public enum OrderStatus {
        PENDING,
        CONFIRMED,
        PREPARING,
        OUT_FOR_DELIVERY,
        DELIVERED,
        CANCELLED
    }
}
