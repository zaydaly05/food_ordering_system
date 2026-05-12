package com.foodordering.mvc.controller;

import com.foodordering.mvc.DTO.PaymentRequest;
import com.foodordering.mvc.model.Cart;
import com.foodordering.mvc.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    // Save cart to database when Checkout is clicked
    @PostMapping("/checkout")
    public Cart checkout(@RequestBody Cart cart) {
        return cartService.checkout(cart);
    }

    // Save payment method (CASH or VISA)
    @PutMapping("/{cartId}/payment")
    public Cart updatePaymentMethod(
            @PathVariable String cartId,
            @RequestBody PaymentRequest request) {
        return cartService.updatePaymentMethod(cartId, request);
    }
}