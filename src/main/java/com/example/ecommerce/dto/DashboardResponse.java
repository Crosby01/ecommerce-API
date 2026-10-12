package com.example.ecommerce.dto;

public class DashboardResponse {

    private long products;
    private long orders;
    private double revenue;

    public DashboardResponse(
            long products,
            long orders,
            double revenue
    ) {
        this.products = products;
        this.orders = orders;
        this.revenue = revenue;
    }

    public long getProducts() {
        return products;
    }

    public long getOrders() {
        return orders;
    }

    public double getRevenue() {
        return revenue;
    }
}