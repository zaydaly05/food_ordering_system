package com.foodordering.mvc.service;

import com.foodordering.mvc.DTO.CreateDeliveryRequest;
import com.foodordering.mvc.model.Delivery;
import com.foodordering.mvc.model.Payment;
import com.foodordering.mvc.repository.DeliveryRepository;
import com.foodordering.mvc.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

// Single Responsibility: DeliveryService only handles delivery logic
@Service
@RequiredArgsConstructor
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final PaymentRepository paymentRepository;

    // Create delivery — only allowed after successful payment
    public Delivery createDelivery(CreateDeliveryRequest request) {
        // Enforce: delivery only after successful payment
        Payment payment = paymentRepository.findByOrderId(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("No payment found for this order. Pay first."));

        if (!Payment.PaymentStatus.COMPLETED.name().equals(payment.getPaymentStatus())) {
            throw new RuntimeException("Payment is not completed. Delivery cannot be created.");
        }

        // Prevent duplicate deliveries
        deliveryRepository.findByOrderId(request.getOrderId()).ifPresent(d -> {
            throw new RuntimeException("Delivery already exists for this order");
        });

        Delivery delivery = Delivery.builder()
                .orderId(request.getOrderId())
                .deliveryPersonName(request.getDeliveryPersonName())
                .deliveryPhone(request.getDeliveryPhone())
                .deliveryAddress(request.getDeliveryAddress())
                .estimatedDeliveryTime(request.getEstimatedDeliveryTime())
                .deliveryStatus(Delivery.DeliveryStatus.PENDING.name())
                .createdAt(LocalDateTime.now())
                .build();

        return deliveryRepository.save(delivery);
    }

    // Get delivery for a specific order
    public Delivery getDeliveryByOrderId(String orderId) {
        return deliveryRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Delivery not found for order: " + orderId));
    }

    // Update delivery status
    public Delivery updateDeliveryStatus(String deliveryId, String status) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found with id: " + deliveryId));

        delivery.setDeliveryStatus(status);
        return deliveryRepository.save(delivery);
    }

    // Get all deliveries (admin)
    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAllByOrderByCreatedAtDesc();
    }
}