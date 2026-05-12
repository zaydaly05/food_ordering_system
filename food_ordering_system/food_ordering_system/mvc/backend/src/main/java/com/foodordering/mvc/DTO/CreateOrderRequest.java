package com.foodordering.mvc.DTO;

import com.foodordering.mvc.model.Order;
import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {
    private String userId;   
    private List<Order.OrderItem> items;
    private String address;
}
