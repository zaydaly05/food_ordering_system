package com.foodordering.mvc.controller;

import com.foodordering.mvc.DTO.CreatePaymentRequest;
import com.foodordering.mvc.model.Payment;
import com.foodordering.mvc.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // POST /api/payments — create a new payment for an order
    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody CreatePaymentRequest request) {
        return ResponseEntity.ok(paymentService.createPayment(request));
    }

    // GET /api/payments/order/{orderId} — get payment by order ID
    @GetMapping("/order/{orderId}")
    public ResponseEntity<Payment> getPaymentByOrder(@PathVariable String orderId) {
        return ResponseEntity.ok(paymentService.getPaymentByOrderId(orderId));
    }

    // PUT /api/payments/{paymentId}/status — update payment status
    @PutMapping("/{paymentId}/status")
    public ResponseEntity<Payment> updateStatus(
            @PathVariable String paymentId,
            @RequestParam String status
    ) {
        return ResponseEntity.ok(paymentService.updatePaymentStatus(paymentId, status));
    }

    // GET /api/payments — get all payments (admin)
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    // Simple error handler for this controller
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleError(RuntimeException ex) {
        return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
    }

    @DeleteMapping("/{paymentId}")
    public ResponseEntity<Map<String, String>> deletePayment(@PathVariable String paymentId) {
        paymentService.deletePayment(paymentId);
        return ResponseEntity.ok(Map.of("message", "Payment deleted successfully"));
    }
}