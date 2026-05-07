package com.foodordering.mvc.controller;
import com.foodordering.mvc.DTO.CreateOrderRequest;
import com.foodordering.mvc.model.Order;
import com.foodordering.mvc.model.Order.OrderStatus;
import com.foodordering.mvc.persistence.UserDocument;
import com.foodordering.mvc.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;


// implementation of order conttroller with endpoints for creating, updating, deleting and fetching orders. also includes endpoint to fetch all orders with user details.
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> create(@RequestBody CreateOrderRequest request) {

        return ResponseEntity.ok(orderService.createOrder(request));
    }

    @GetMapping("/all/orders")
        public List<Map<String, Object>> getAllOrders() {
        return orderService.getAllOrdersWithUsers();
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable String userId) {
        return ResponseEntity.ok(orderService.getUserOrders(userId));
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateStatus(
            @PathVariable String orderId,
            @RequestParam OrderStatus status
    ) {
        return ResponseEntity.ok(orderService.updateStatus(orderId, status));
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> delete(@PathVariable String orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.noContent().build();
    }
}

