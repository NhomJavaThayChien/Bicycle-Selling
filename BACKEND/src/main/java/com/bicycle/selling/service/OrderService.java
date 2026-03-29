package com.bicycle.selling.service;

import com.bicycle.selling.dto.CreateOrderRequest;
import com.bicycle.selling.dto.OrderResponse;
import com.bicycle.selling.model.*;
import com.bicycle.selling.model.enums.ListingStatus;
import com.bicycle.selling.model.enums.OrderStatus;
import com.bicycle.selling.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final BicycleListingRepository listingRepository;

    private String generateOrderCode() {
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String random = String.valueOf(ThreadLocalRandom.current().nextInt(100, 999));

        return "ORD-" + date + "-" + random;
    }

    @Transactional
    public Order createOrder(CreateOrderRequest request, Long buyer_id) {

        User buyer = userRepository.findById(buyer_id)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));

        BicycleListing listing = listingRepository.findByIdForUpdate(request.getListingId())
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        // Check listing
        if (listing.getSeller().getId().equals(buyer_id)) {
            throw new RuntimeException("Buyer cannot purchase their own listing");
        }
        if (listing.getStatus() != ListingStatus.APPROVED) {
            throw new RuntimeException("Listing is not available for purchase");
        }

        // Check trong order co ton tai listing id chua thanh toan hay da mua
        Order existingOrder = orderRepository.findByListingId(listing.getId());
        if (existingOrder != null && existingOrder.getStatus() != OrderStatus.CANCELLED) {
            throw new RuntimeException("Listing is already reserved or sold");
        }

        BigDecimal agreedPrice = request.getAgreedPrice() != null ? request.getAgreedPrice() : listing.getPrice();

        BigDecimal deposit = agreedPrice.multiply(BigDecimal.valueOf(0.2));

        Order order = Order.builder()
                .orderCode(generateOrderCode())
                .buyer(buyer)
                .listing(listing)
                .agreedPrice(agreedPrice)
                .depositAmount(deposit)
                .note(request.getNote())
                .shippingAddress(request.getShippingAddress())
                .build();
        // Set trạng ngay trong transaction để tránh race condition
        listing.setStatus(ListingStatus.RESERVED);

        return orderRepository.save(order);
    }

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public Order setOrderStatus(Long orderId, OrderStatus status) {
        Order order = getOrderById(orderId);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public Order setConfirmOrder(Long orderId) {
        Order order = getOrderById(orderId);
        if (order.getStatus() != OrderStatus.DEPOSIT_PAID) {
            throw new RuntimeException("Order must be in DEPOSIT_PAID status to confirm");
        }
        order.setStatus(OrderStatus.CONFIRMED);
        return orderRepository.save(order);
    }

    public List<OrderResponse> getOrderByUserId(Long userId) {
        List<Order> orders = orderRepository.findByBuyerId(userId);
        if (orders.isEmpty()) {
            return Collections.emptyList();
        }
        return orders.stream().map(order -> new OrderResponse(
                order.getId(),
                order.getBuyer().getId(),
                order.getListing().getId(),
                order.getAgreedPrice(),
                order.getStatus().name()
        )).toList();
    }
}