package com.example.ecommerce.service;

import com.example.ecommerce.dto.DashboardResponse;
import com.example.ecommerce.repository.OrderRepository;
import com.example.ecommerce.repository.ProductRepository;

import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public DashboardService(
            ProductRepository productRepository,
            OrderRepository orderRepository
    ) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    public DashboardResponse getDashboard() {

        long products = productRepository.count();

        long orders = orderRepository.count();

        Double revenue =
                orderRepository.sumTotalAmountByStatus("PAID");

        if (revenue == null) {
            revenue = 0.0;
        }

        return new DashboardResponse(
                products,
                orders,
                revenue
        );
    }
}