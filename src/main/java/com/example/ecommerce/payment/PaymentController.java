package com.example.ecommerce.payment;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.stripe.exception.StripeException;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create")
    public ResponseEntity<PaymentResponse> createPayment(
            Authentication authentication) throws StripeException {

        String email = authentication.getName();

        return ResponseEntity.ok(
                paymentService.createCheckoutSession(email));
    }
}