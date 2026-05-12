package com.foodordering.mvc.DTO;

import lombok.Data;
import java.util.List;

@Data
public class CreateOrderRequest {

    private String userId;
    private String address;
    private List<OrderItemRequest> items;

    @Data
    public static class OrderItemRequest {
        private String productId;
        private int quantity;
    }
}