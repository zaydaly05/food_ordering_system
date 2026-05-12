package com.foodordering.mvc.service;

import com.foodordering.mvc.model.Cart;
import com.foodordering.mvc.model.CartItem;
import com.foodordering.mvc.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    public Cart addToCart(String userId, CartItem item) {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUserId(userId);
                    newCart.setItems(new ArrayList<>());
                    return newCart;
                });

    
        boolean itemExists = false;

        for (CartItem cartItem : cart.getItems()) {
            if (cartItem.getProductId().equals(item.getProductId())) {
                cartItem.setQuantity(cartItem.getQuantity() + item.getQuantity());
                itemExists = true;
                break;
            }
        }

        if (!itemExists) {
            cart.getItems().add(item);
        }

        double total = cart.getItems()
                .stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();

        cart.setTotalPrice(total);

        return cartRepository.save(cart);
    }


    public Cart getUserCart(String userId) {
        return cartRepository.findByUserId(userId)
                    .orElse(new Cart());
    }


    public Cart updateQuantity(String userId, String productId, int change) {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        for (CartItem item : cart.getItems()) {
            if (item.getProductId().equals(productId)) {

                int newQty = item.getQuantity() + change;

                if (newQty <= 0) {
                    cart.getItems().remove(item);
                } else {
                    item.setQuantity(newQty);
                }

                break;
            }
        }

        double total = cart.getItems()
                .stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();

        cart.setTotalPrice(total);

        return cartRepository.save(cart);
    }


    public Cart removeItem(String userId, String productId) {

    Cart cart = cartRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Cart not found"));

    
    cart.getItems().removeIf(item ->
            item.getProductId().equals(productId)
    );

    double total = cart.getItems()
            .stream()
            .mapToDouble(i -> i.getPrice() * i.getQuantity())
            .sum();

    cart.setTotalPrice(total);

    return cartRepository.save(cart);
}
}