package com.example.ecommerce.payment;

import com.example.ecommerce.service.OrderService;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class StripeWebhookController {

    private final OrderService orderService;

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    public StripeWebhookController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String signature) {

        Event event;

        try {
            event = Webhook.constructEvent(
                    payload,
                    signature,
                    webhookSecret
            );

        } catch (SignatureVerificationException e) {

            return ResponseEntity.badRequest()
                    .body("Invalid Stripe signature");
        }

        if ("checkout.session.completed".equals(event.getType())) {

            System.out.println("STRIPE WEBHOOK RECEIVED");

            Session session = (Session) event.getDataObjectDeserializer()
                    .getObject()
                    .orElseThrow(
                            () -> new IllegalStateException(
                                    "Unable to deserialize Stripe session"
                            )
                    );

            String orderId = session.getMetadata().get("orderId");

            System.out.println(
                    "ORDER ID FROM STRIPE: " + orderId
            );

            if (orderId != null) {

                orderService.completeOrder(
                        Long.parseLong(orderId)
                );
            }
        }

        return ResponseEntity.ok("Webhook received");
    }
}