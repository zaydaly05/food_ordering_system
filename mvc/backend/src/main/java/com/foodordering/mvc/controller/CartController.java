package com.foodordering.mvc.controller;


import com.foodordering.mvc.model.Cart;
import com.foodordering.mvc.model.CartItem;
import com.foodordering.mvc.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/{userId}/add")
    public Cart addToCart(
            @PathVariable String userId,
            @RequestBody CartItem item
    ) {
        return cartService.addToCart(userId, item);
    }

    @PutMapping("/{userId}/update/{productId}")
    public Cart updateQuantity(
            @PathVariable String userId,
            @PathVariable String productId,
            @RequestParam int change
    ) {
        return cartService.updateQuantity(userId, productId, change);
    }

    @GetMapping("/{userId}")
    public Cart getUserCart(@PathVariable String userId) {
        return cartService.getUserCart(userId);
    }

    @DeleteMapping("/{userId}/item/{itemId}")
    public Cart removeItem(
            @PathVariable String userId,
            @PathVariable String itemId
    ) {
        return cartService.removeItem(userId, itemId);
    }
}