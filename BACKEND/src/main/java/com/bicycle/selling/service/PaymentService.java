package com.bicycle.selling.service;

import com.bicycle.selling.dto.PaymentResponse;
import com.bicycle.selling.infrastructure.StripeService;
import com.bicycle.selling.model.Order;
import com.bicycle.selling.model.Payment;
import com.bicycle.selling.model.enums.OrderStatus;
import com.bicycle.selling.model.enums.PaymentMethod;
import com.bicycle.selling.model.enums.PaymentStatus;
import com.bicycle.selling.repository.OrderRepository;
import com.bicycle.selling.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {

    private final StripeService stripeService;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public PaymentService(StripeService stripeService,
                          PaymentRepository paymentRepository,
                          OrderRepository orderRepository) {
        this.stripeService = stripeService;
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }

    
    public String PaymentDeposit(Long orderId, String currency) throws StripeException {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new IllegalArgumentException("Order not found"));
        BigDecimal depositAmount = order.getDepositAmount();

        if (depositAmount == null || depositAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Invalid deposit amount");
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new IllegalStateException("Order is not in a valid state for deposit");
        }

        PaymentIntent paymentIntent = stripeService.createPaymentIntent(
                depositAmount,
                currency,
                "Deposit for order " + order.getId()
        );

        String checkoutSession = stripeService.createCheckoutSession(depositAmount, currency);

        Payment depositPayment = Payment.builder()
                .order(order)
                .amount(depositAmount)
                .currency("VND")
                .method(PaymentMethod.STRIPE)
                .status(PaymentStatus.SUCCESS) // Stripe confirm -> success
                .isDeposit(true)
                .stripePaymentIntentId(paymentIntent.getId())
                .stripeMetadata(paymentIntent.toJson())
                .paidAt(LocalDateTime.now())
                .build();

        
        try {
            System.out.println("Saving payment record for order " + orderId);
            paymentRepository.save(depositPayment);
        } catch (Exception e) {
            // Log lỗi chi tiết để debug
            System.err.println("Error saving payment: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to save payment record");
        }

        order.setStatus(OrderStatus.DEPOSIT_PAID);
        orderRepository.save(order);

        return checkoutSession;
    }

    public List<PaymentResponse> getPaymentsByUserId(Long userId) {
        List<Payment> payments = paymentRepository.findByOrderBuyerId(userId);
        return payments.stream().map(payment -> new PaymentResponse(
                payment.getId(),
                payment.getAmount(),
                payment.getCurrency(),
                payment.getStatus().name(),
                payment.getOrder().getId().toString(),
                payment.getPaidAt() != null ? payment.getPaidAt().toString() : null,
                payment.getUpdatedAt() != null ? payment.getUpdatedAt().toString() : null
        )).toList();
    }
}