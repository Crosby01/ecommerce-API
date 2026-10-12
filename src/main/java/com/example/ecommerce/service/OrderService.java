package com.example.ecommerce.service;

import com.example.ecommerce.dto.OrderItemResponse;
import com.example.ecommerce.dto.OrderResponse;
import com.example.ecommerce.entity.Cart;
import com.example.ecommerce.entity.CartItem;
import com.example.ecommerce.entity.Order;
import com.example.ecommerce.entity.OrderItem;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.entity.User;
import com.example.ecommerce.exception.BadRequestException;
import com.example.ecommerce.exception.ResourceNotFoundException;
import com.example.ecommerce.repository.CartItemRepository;
import com.example.ecommerce.repository.CartRepository;
import com.example.ecommerce.repository.OrderItemRepository;
import com.example.ecommerce.repository.OrderRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            UserRepository userRepository
    ) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );

        return orderRepository.findByUser(user)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {

        return orderRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(
            String email,
            Long orderId
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found"
                        )
                );

        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException(
                    "You cannot view another user's order"
            );
        }

        return convertToResponse(order);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderByIdForAdmin(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found"
                        )
                );

        return convertToResponse(order);
    }

    @Transactional
    public OrderResponse updateOrderStatus(
            Long orderId,
            String status
    ) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found"
                        )
                );

        order.setStatus(status);

        Order savedOrder = orderRepository.save(order);

        return convertToResponse(savedOrder);
    }

    @Transactional
    public Order createPendingOrder(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Cart not found"
                        )
                );

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException(
                    "Cannot checkout an empty cart"
            );
        }

        double totalAmount = 0;

        for (CartItem cartItem : cart.getItems()) {

            Product product = cartItem.getProduct();
            int quantity = cartItem.getQuantity();

            if (product.getStock() < quantity) {
                throw new BadRequestException(
                        "Not enough stock for product: "
                                + product.getName()
                );
            }

            totalAmount += product.getPrice() * quantity;
        }

        Order order = new Order(
                user,
                totalAmount,
                "PENDING"
        );

        orderRepository.save(order);

        for (CartItem cartItem : cart.getItems()) {

            Product product = cartItem.getProduct();

            OrderItem orderItem = new OrderItem(
                    order,
                    product,
                    cartItem.getQuantity(),
                    product.getPrice()
            );

            orderItemRepository.save(orderItem);
            order.getItems().add(orderItem);
        }

        return order;
    }

    @Transactional
    public void completeOrder(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found"
                        )
                );

        if ("PAID".equals(order.getStatus())) {
            return;
        }

        Cart cart = cartRepository.findByUser(order.getUser())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Cart not found"
                        )
                );

        for (OrderItem orderItem : order.getItems()) {

            Product product = orderItem.getProduct();

            if (product == null) {
                throw new ResourceNotFoundException(
                        "Product for order item not found"
                );
            }

            if (product.getStock() < orderItem.getQuantity()) {
                throw new BadRequestException(
                        "Not enough stock for product: "
                                + product.getName()
                );
            }

            product.setStock(
                    product.getStock()
                            - orderItem.getQuantity()
            );

            productRepository.save(product);
        }

        cartItemRepository.deleteAll(cart.getItems());
        cart.getItems().clear();

        order.setStatus("PAID");

        orderRepository.save(order);
    }

    private OrderResponse convertToResponse(Order order) {

        List<OrderItemResponse> items = order.getItems()
                .stream()
                .map(item -> {

                    Product product = item.getProduct();

                    if (product == null) {
                        return new OrderItemResponse(
                                null,
                                "Product no longer available",
                                item.getQuantity(),
                                item.getPrice()
                        );
                    }

                    return new OrderItemResponse(
                            product.getId(),
                            product.getName(),
                            item.getQuantity(),
                            item.getPrice()
                    );
                })
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getUser().getEmail(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getCreatedAt(),
                items
        );
    }
}