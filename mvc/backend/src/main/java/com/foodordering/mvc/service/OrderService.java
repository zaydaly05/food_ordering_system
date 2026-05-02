package com.foodordering.mvc.service;
import com.foodordering.mvc.model.Order;
import com.foodordering.mvc.persistence.UserDocument;
import com.foodordering.mvc.repository.OrderRepository;
import com.foodordering.mvc.DTO.CreateOrderRequest;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    public Order createOrder(CreateOrderRequest request) {

        double total = request.getItems()
                .stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();

        Order order = Order.builder()
                .userId(request.getUserId())   // 👈 FIX HERE
                .items(request.getItems())
                .totalPrice(total)
                .status(Order.OrderStatus.PENDING)
                .address(request.getAddress())
                .createdAt(LocalDateTime.now())
                .build();

        return orderRepository.save(order);
    }
     public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }


    public List<Order> getUserOrders(String userId) {
        return orderRepository.findByUserId(userId);
    }

    public Order updateStatus(String orderId, Order.OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);
        return orderRepository.save(order);
    }

    public void deleteOrder(String orderId) {
        orderRepository.deleteById(orderId);
    }
}
