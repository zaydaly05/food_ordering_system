package com.foodordering.mvc.DTO;

import com.foodordering.mvc.model.Order;
import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {
    private String userId;
    private List<OrderItemRequest> items;
    private String address;

    @Data
    public static class OrderItemRequest {
        private String productId;
        private int quantity;
    }
}