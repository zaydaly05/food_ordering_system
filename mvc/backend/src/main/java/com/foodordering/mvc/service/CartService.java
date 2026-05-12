package com.foodordering.mvc.service;

import com.foodordering.mvc.DTO.PaymentRequest;
import com.foodordering.mvc.model.Cart;
import com.foodordering.mvc.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    // Save cart when user clicks Checkout
    public Cart checkout(Cart cart) {
        cart.setStatus("CHECKOUT");
        return cartRepository.save(cart);
    }

    // Update payment method
    public Cart updatePaymentMethod(String cartId, PaymentRequest request) {
        Optional<Cart> optionalCart = cartRepository.findById(cartId);

        if (optionalCart.isPresent()) {
            Cart cart = optionalCart.get();
            cart.setPaymentMethod(request.getPaymentMethod());
            return cartRepository.save(cart);
        }

        throw new RuntimeException("Cart not found");
    }
}