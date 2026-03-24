package com.bicycle.selling.service;

import com.bicycle.selling.dto.CreateOrderRequest;
import com.bicycle.selling.model.*;
import com.bicycle.selling.model.enums.ListingStatus;
import com.bicycle.selling.model.enums.OrderStatus;
import com.bicycle.selling.model.enums.PaymentMethod;
import com.bicycle.selling.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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

        BicycleListing listing = listingRepository.findById(request.getListingId())
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (listing.getStatus() != ListingStatus.APPROVED) {
            throw new RuntimeException("Listing is not available for purchase");
        }

        BigDecimal agreedPrice = listing.getPrice();

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

        return orderRepository.save(order);
    }
}