package com.foodordering.mvc.repository;

import com.foodordering.mvc.model.Delivery;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface DeliveryRepository extends MongoRepository<Delivery, String> {
    Optional<Delivery> findByOrderId(String orderId);
    List<Delivery> findAllByOrderByCreatedAtDesc();
}