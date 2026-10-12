package com.example.ecommerce.dto;

import java.util.List;

public class CartResponse {

    private Long id;
    private String userEmail;
    private List<CartItemResponse> items;

    public CartResponse(
            Long id,
            String userEmail,
            List<CartItemResponse> items
    ) {
        this.id = id;
        this.userEmail = userEmail;
        this.items = items;
    }

    public Long getId() {
        return id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public List<CartItemResponse> getItems() {
        return items;
    }
}