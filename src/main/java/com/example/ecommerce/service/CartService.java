package com.example.ecommerce.service;

import com.example.ecommerce.dto.CartItemResponse;
import com.example.ecommerce.dto.CartResponse;
import com.example.ecommerce.entity.Cart;
import com.example.ecommerce.entity.CartItem;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.entity.User;
import com.example.ecommerce.exception.BadRequestException;
import com.example.ecommerce.exception.ResourceNotFoundException;
import com.example.ecommerce.repository.CartItemRepository;
import com.example.ecommerce.repository.CartRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            UserRepository userRepository
    ) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public CartResponse addToCart(
            String email,
            Long productId,
            int quantity
    ) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found")
                );

        if (quantity <= 0) {
            throw new BadRequestException(
                    "Quantity must be greater than zero"
            );
        }

        if (product.getStock() < quantity) {
            throw new BadRequestException(
                    "Not enough stock available"
            );
        }

        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(new Cart(user)));

        removeItemsWithMissingProducts(cart);

        CartItem cartItem = cartItemRepository
                .findByCartAndProduct(cart, product)
                .orElse(null);

        if (cartItem != null) {
            int newQuantity = cartItem.getQuantity() + quantity;

            if (newQuantity > product.getStock()) {
                throw new BadRequestException(
                        "Not enough stock available"
                );
            }

            cartItem.setQuantity(newQuantity);
        } else {
            cartItem = new CartItem(cart, product, quantity);
            cart.getItems().add(cartItem);
        }

        cartItemRepository.save(cartItem);

        return convertToResponse(cart);
    }

    @Transactional
    public CartResponse getCart(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(new Cart(user)));

        removeItemsWithMissingProducts(cart);

        return convertToResponse(cart);
    }

    @Transactional
    public void removeFromCart(String email, Long cartItemId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Cart not found")
                );

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Cart item not found")
                );

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException(
                    "You cannot remove another user's cart item"
            );
        }

        cartItemRepository.delete(cartItem);
        cart.getItems().remove(cartItem);
    }

    @Transactional
    public CartResponse updateCartItem(
            String email,
            Long cartItemId,
            int quantity
    ) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Cart not found")
                );

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Cart item not found")
                );

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException(
                    "You cannot update another user's cart item"
            );
        }

        Product product = cartItem.getProduct();

        if (product == null) {
            cartItemRepository.delete(cartItem);
            cart.getItems().remove(cartItem);

            throw new ResourceNotFoundException(
                    "This product is no longer available. The stale cart item was removed."
            );
        }

        if (quantity <= 0) {
            throw new BadRequestException(
                    "Quantity must be greater than zero"
            );
        }

        if (quantity > product.getStock()) {
            throw new BadRequestException(
                    "Not enough stock available"
            );
        }

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);

        return convertToResponse(cart);
    }

    private void removeItemsWithMissingProducts(Cart cart) {
        List<CartItem> staleItems = cart.getItems()
                .stream()
                .filter(item -> item.getProduct() == null)
                .toList();

        if (!staleItems.isEmpty()) {
            cartItemRepository.deleteAll(staleItems);
            cart.getItems().removeAll(staleItems);
        }
    }

    private CartResponse convertToResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems()
                .stream()
                .filter(item -> item.getProduct() != null)
                .map(item -> new CartItemResponse(
                        item.getId(),
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getPrice(),
                        item.getQuantity()
                ))
                .toList();

        return new CartResponse(
                cart.getId(),
                cart.getUser().getEmail(),
                items
        );
    }
}
