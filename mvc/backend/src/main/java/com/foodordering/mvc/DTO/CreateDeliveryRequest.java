package com.foodordering.mvc.DTO;

import lombok.Data;

@Data
public class CreateDeliveryRequest {
    private String orderId;
    private String deliveryPersonName;
    private String deliveryPhone;
    private String deliveryAddress;
    private String estimatedDeliveryTime;
}