package com.example.ecommerce.payment;

import com.example.ecommerce.entity.Cart;
import com.example.ecommerce.entity.CartItem;
import com.example.ecommerce.entity.Order;
import com.example.ecommerce.entity.User;
import com.example.ecommerce.exception.ResourceNotFoundException;
import com.example.ecommerce.repository.CartRepository;
import com.example.ecommerce.repository.UserRepository;
import com.example.ecommerce.service.OrderService;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PaymentService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final OrderService orderService;

    public PaymentService(
            CartRepository cartRepository,
            UserRepository userRepository,
            OrderService orderService,
            @Value("${stripe.secret-key}") String stripeSecretKey) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.orderService = orderService;

        Stripe.apiKey = stripeSecretKey;
    }

    public PaymentResponse createCheckoutSession(String email)
            throws StripeException {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException(
                    "Cannot create payment for an empty cart");
        }

        // Create the order as PENDING
        Order order = orderService.createPendingOrder(email);

        List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();

        for (CartItem cartItem : cart.getItems()) {

            long priceInKobo = Math.round(
                    cartItem.getProduct().getPrice() * 100);

            SessionCreateParams.LineItem.PriceData.ProductData productData = SessionCreateParams.LineItem.PriceData.ProductData
                    .builder()
                    .setName(
                            cartItem.getProduct().getName())
                    .setDescription(
                            cartItem.getProduct().getDescription())
                    .build();

            SessionCreateParams.LineItem.PriceData priceData = SessionCreateParams.LineItem.PriceData
                    .builder()
                    .setCurrency("ngn")
                    .setUnitAmount(priceInKobo)
                    .setProductData(productData)
                    .build();

            SessionCreateParams.LineItem lineItem = SessionCreateParams.LineItem
                    .builder()
                    .setQuantity(
                            (long) cartItem.getQuantity())
                    .setPriceData(priceData)
                    .build();

            lineItems.add(lineItem);
        }

        SessionCreateParams.Builder sessionBuilder = SessionCreateParams.builder()
        .setMode(SessionCreateParams.Mode.PAYMENT)
        .putMetadata(
                "orderId",
                order.getId().toString())
        .setSuccessUrl(
                "http://localhost:5173/success")
        .setCancelUrl(
                "http://localhost:5173/payment");

        for (SessionCreateParams.LineItem lineItem : lineItems) {
            sessionBuilder.addLineItem(lineItem);
        }

        Session session = Session.create(
                sessionBuilder.build());

        return new PaymentResponse(
                session.getUrl());
    }
}