package com.foodordering.mvc.service;

import com.foodordering.mvc.DTO.CreatePaymentRequest;
import com.foodordering.mvc.model.Order;
import com.foodordering.mvc.model.Payment;
import com.foodordering.mvc.repository.OrderRepository;
import com.foodordering.mvc.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

// Single Responsibility: PaymentService only handles payment logic
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    // Create a new payment for an order.
    // totalAmount comes directly from the Order — never hardcoded.
    public Payment createPayment(CreatePaymentRequest request) {
        // Check if payment already exists for this order
        paymentRepository.findByOrderId(request.getOrderId()).ifPresent(p -> {
            throw new RuntimeException("Payment already exists for this order");
        });

        // Fetch the order to get the real total price
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + request.getOrderId()));

        Payment payment = Payment.builder()
                .orderId(request.getOrderId())
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(Payment.PaymentStatus.PENDING.name())
                .totalAmount(order.getTotalPrice()) // always from Order
                .transactionDate(LocalDateTime.now())
                .build();

        return paymentRepository.save(payment);
    }

    // Get payment linked to a specific order
    public Payment getPaymentByOrderId(String orderId) {
        return paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found for order: " + orderId));
    }

    // Update payment status (PENDING → COMPLETED or FAILED)
    public Payment updatePaymentStatus(String paymentId, String status) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + paymentId));

        payment.setPaymentStatus(status);
        return paymentRepository.save(payment);
    }

    // Get all payments (admin)
    public List<Payment> getAllPayments() {
        return paymentRepository.findAllByOrderByTransactionDateDesc();
    }
    // Delete a payment by ID
    public void deletePayment(String paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + paymentId));
        paymentRepository.delete(payment);
    }
}