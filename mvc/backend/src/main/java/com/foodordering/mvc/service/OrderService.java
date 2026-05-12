package com.foodordering.mvc.service;
import com.foodordering.mvc.model.Menuitem;
import com.foodordering.mvc.model.Order;
import com.foodordering.mvc.model.User;
import com.foodordering.mvc.notification.NotificationInterface;
import com.foodordering.mvc.repository.OrderRepository;

import com.foodordering.mvc.DTO.CreateOrderRequest;
import com.foodordering.mvc.DTO.NotificationRequest;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


// implementation of order service
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserService userService;
    private final MenuitemService menuitemService;


    @Autowired
   
    
    private NotificationInterface orderEmail = new EmailService();

    public Order createOrder(CreateOrderRequest request) {

    List<Order.OrderItem> orderItems = request.getItems().stream()
    .map(item -> {

        Menuitem menuItem =
            menuitemService.getMenuItemById(item.getProductId());

        return new Order.OrderItem(
            menuItem.getId(),
            menuItem.getName(),
            menuItem.getPrice(),
            item.getQuantity()
        );
    }).toList();

    double total = orderItems.stream()
            .mapToDouble(i -> i.getPrice() * i.getQuantity())
            .sum();

    Order order = Order.builder()
            .userId(request.getUserId())
            .items(orderItems)
            .totalPrice(total)
            .status(Order.OrderStatus.PENDING)
            .address(request.getAddress())
            .createdAt(LocalDateTime.now())
            .build();


        User user = userService.getUserById(request.getUserId()).orElse(null);
        
        NotificationRequest req = new NotificationRequest();

        req.setTo(user.getEmail());
        req.setSubject("Order Received");
        req.setMessage(
        "Hello " + user.getName() + "\n" +
        "Your order" + " has been received, great stuff are working on it" + ".\n\n" +
        "Thank you for shopping with us!"   
        );
        

        try {
            if (user != null && user.getEmail() != null) {
              
                orderEmail.sendNotification(req);
                System.out.println("Email sent to: " + user.getEmail());
            }
        }   catch (Exception e) {
                System.out.println("Failed to send email notification: " + e.getMessage());
            }
        

        return orderRepository.save(order);
    }
     public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Map<String, Object>> getAllOrdersWithUsers() {
        List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();
        return orders.stream().map(order -> {

            Map<String, Object> result = new HashMap<>();

            result.put("id", order.getId());
            result.put("items", order.getItems());
            result.put("totalPrice", order.getTotalPrice());
            result.put("status", order.getStatus());
            result.put("address", order.getAddress());
            result.put("createdAt", order.getCreatedAt());

            User user = userService.getUserById(order.getUserId()).orElse(null);

            result.put("userName", user.getName() != null ? user.getName() : "Unknown");
            result.put("phone", user.getPhone() != null ? user.getPhone() : "Unknown");



            return result;
        }).toList();
    }


    public List<Order> getUserOrders(String userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Order updateStatus(String orderId, Order.OrderStatus status) {
        
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);

        User user = userService.getUserById(order.getUserId()).orElse(null);

        NotificationRequest req = new NotificationRequest();

        req.setTo(user.getEmail());
        req.setSubject("Order Status Updated");
        req.setMessage(
        "Hello " + user.getName() + "\n" +
        "Your order #" + order.getId() + " is " + order.getStatus() + ".\n\n" +
        "Thank you for shopping with us!"   
        );
        

        try {
            if (user != null && user.getEmail() != null) {
              
                orderEmail.sendNotification(req);
                System.out.println("Email sent to: " + user.getEmail());
            }
        }   catch (Exception e) {
                System.out.println("Failed to send email notification: " + e.getMessage());
            }
        return updatedOrder;
    }

    public void deleteOrder(String orderId) {
        orderRepository.deleteById(orderId);
    }
}
