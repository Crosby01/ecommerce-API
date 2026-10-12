package com.example.ecommerce.controller;

import com.example.ecommerce.dto.CartResponse;
import com.example.ecommerce.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping
    public ResponseEntity<CartResponse> addToCart(
            @RequestParam Long productId,
            @RequestParam int quantity,
            Authentication authentication
    ) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                cartService.addToCart(
                        email,
                        productId,
                        quantity
                )
        );
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart(
            Authentication authentication
    ) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                cartService.getCart(email)
        );
    }

    @PutMapping("/{cartItemId}")
public ResponseEntity<CartResponse> updateCartItem(
        @PathVariable Long cartItemId,
        @RequestParam int quantity,
        Authentication authentication
) {

    String email = authentication.getName();

    return ResponseEntity.ok(
            cartService.updateCartItem(
                    email,
                    cartItemId,
                    quantity
            )
    );
}

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<Void> removeFromCart(
            @PathVariable Long cartItemId,
            Authentication authentication
    ) {

        String email = authentication.getName();

        cartService.removeFromCart(
                email,
                cartItemId
        );

        return ResponseEntity.noContent().build();
    }
}