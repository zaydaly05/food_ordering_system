package com.foodordering.mvc.controller;

import com.foodordering.mvc.DTO.CreateDeliveryRequest;
import com.foodordering.mvc.model.Delivery;
import com.foodordering.mvc.service.DeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/deliveries")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;

    // POST /api/deliveries — create delivery (only after successful payment)
    @PostMapping
    public ResponseEntity<Delivery> createDelivery(@RequestBody CreateDeliveryRequest request) {
        return ResponseEntity.ok(deliveryService.createDelivery(request));
    }

    // GET /api/deliveries/order/{orderId} — get delivery by order ID
    @GetMapping("/order/{orderId}")
    public ResponseEntity<Delivery> getDeliveryByOrder(@PathVariable String orderId) {
        return ResponseEntity.ok(deliveryService.getDeliveryByOrderId(orderId));
    }

    // PUT /api/deliveries/{deliveryId}/status — update delivery status
    @PutMapping("/{deliveryId}/status")
    public ResponseEntity<Delivery> updateStatus(
            @PathVariable String deliveryId,
            @RequestParam String status
    ) {
        return ResponseEntity.ok(deliveryService.updateDeliveryStatus(deliveryId, status));
    }

    // GET /api/deliveries — get all deliveries (admin)
    @GetMapping
    public ResponseEntity<List<Delivery>> getAllDeliveries() {
        return ResponseEntity.ok(deliveryService.getAllDeliveries());
    }

    // Simple error handler for this controller
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleError(RuntimeException ex) {
        return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
    }
}