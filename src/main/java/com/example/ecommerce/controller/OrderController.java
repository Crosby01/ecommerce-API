package com.example.ecommerce.controller;

import com.example.ecommerce.dto.OrderResponse;
import com.example.ecommerce.dto.OrderStatusRequest;
import com.example.ecommerce.service.OrderService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/admin/orders")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(
                orderService.getAllOrders()
        );
    }

    @GetMapping("/admin/orders/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable Long orderId
    ) {
        return ResponseEntity.ok(
                orderService.getOrderByIdForAdmin(orderId)
        );
    }

    @PutMapping("/admin/orders/{orderId}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody OrderStatusRequest request
    ) {
        return ResponseEntity.ok(
                orderService.updateOrderStatus(
                        orderId,
                        request.getStatus()
                )
        );
    }

    @GetMapping("/orders")
public ResponseEntity<List<OrderResponse>> getMyOrders(
        Authentication authentication
) {
    return ResponseEntity.ok(
            orderService.getMyOrders(
                    authentication.getName()
            )
    );
}

@GetMapping("/orders/{orderId}")
public ResponseEntity<OrderResponse> getMyOrderById(
        Authentication authentication,
        @PathVariable Long orderId
) {
    return ResponseEntity.ok(
            orderService.getOrderById(
                    authentication.getName(),
                    orderId
            )
    );
}

}