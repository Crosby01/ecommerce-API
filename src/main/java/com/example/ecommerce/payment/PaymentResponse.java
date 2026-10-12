package com.example.ecommerce.payment;

public class PaymentResponse {

    private String checkoutUrl;

    public PaymentResponse(String checkoutUrl) {
        this.checkoutUrl = checkoutUrl;
    }

    public String getCheckoutUrl() {
        return checkoutUrl;
    }
}