package com.example.ecommerce.dto;

public class CartItemResponse {

    private Long id;
    private Long productId;
    private String productName;
    private double price;
    private int quantity;

    public CartItemResponse(
            Long id,
            Long productId,
            String productName,
            double price,
            int quantity
    ) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
    }

    public Long getId() {
        return id;
    }

    public Long getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public double getPrice() {
        return price;
    }

    public int getQuantity() {
        return quantity;
    }
}