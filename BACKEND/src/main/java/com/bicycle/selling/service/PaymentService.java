package com.bicycle.selling.service;

import com.bicycle.selling.dto.PaymentResponse;
import com.bicycle.selling.infrastructure.StripeService;
import com.bicycle.selling.model.Order;
import com.bicycle.selling.model.Payment;
import com.bicycle.selling.model.enums.OrderStatus;
import com.bicycle.selling.model.enums.PaymentMethod;
import com.bicycle.selling.model.enums.PaymentStatus;
import com.bicycle.selling.model.enums.OrderStatus;
import com.bicycle.selling.repository.OrderRepository;
import com.bicycle.selling.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;

import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final StripeService stripeService;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public String PaymentDeposit(Long orderId, String currency, Long requesterId) {
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new IllegalArgumentException("Order not found"));

            Long buyer = order.getBuyer().getId();

            if (!Objects.equals(buyer, requesterId)) {
                throw new RuntimeException("Access denied: only the buyer of this order can payment");
            }

            BigDecimal depositAmount = order.getDepositAmount();

            if (depositAmount == null || depositAmount.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Invalid deposit amount");
            }

            if (order.getStatus() != OrderStatus.PENDING) {
                throw new IllegalStateException("Order is not in a valid state for deposit");
            }

            Session checkoutSession = stripeService.createCheckoutSession(depositAmount, currency, orderId, true);

            Payment depositPayment = Payment.builder()
                    .order(order)
                    .amount(depositAmount)
                    .currency("VND")
                    .method(PaymentMethod.STRIPE)
                    .status(PaymentStatus.PENDING)
                    .isDeposit(true)
                    .paidAt(null)
                    .build();

            paymentRepository.save(depositPayment);
            return checkoutSession.getUrl();
        } catch (StripeException e) {
            throw new RuntimeException("Stripe error: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Error processing payment: " + e.getMessage());
        }
    }

    public List<PaymentResponse> getPaymentsByUserId(Long userId) {
        try {
            List<Payment> payments = paymentRepository.findByOrderBuyerId(userId);
            return payments.stream().map(this::mapToResponse).toList();
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving payments: " + e.getMessage());
        }
    }

    public List<PaymentResponse> getAllPayments() {
        try {
            List<Payment> payments = paymentRepository.findAll();
            return payments.stream().map(this::mapToResponse).toList();
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving all payments: " + e.getMessage());
        }
    }

    @Transactional
    public PaymentResponse markPaymentSuccess(Long paymentId) {
        Payment payment = paymentRepository.findByIdForUpdate(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            return mapToResponse(payment);
        }

        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setPaidAt(java.time.LocalDateTime.now());

        Order order = payment.getOrder();
        if (order != null) {
            if (payment.isDeposit()) {
                order.setStatus(OrderStatus.DEPOSIT_PAID);
            } else {
                order.setStatus(OrderStatus.FULL_PAID);
            }
            orderRepository.save(order);
        }

        Payment saved = paymentRepository.save(payment);
        return mapToResponse(saved);
    }

    private PaymentResponse mapToResponse(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getAmount(),
                payment.getCurrency(),
                payment.getStatus().name(),
                payment.getMethod().name(),
                payment.getOrder().getId().toString(),
                payment.getCreatedAt() != null ? payment.getCreatedAt().toString() : null,
                payment.getUpdatedAt() != null ? payment.getUpdatedAt().toString() : null);
    }

    public String fullPayment(Long orderId, String currency, Long requesterId) {
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new IllegalArgumentException("Order not found"));

            Long buyer = order.getBuyer().getId();
            
            if (!Objects.equals(buyer, requesterId)) {
                throw new RuntimeException("Access denied: only the buyer of this order can payment");
            }

            BigDecimal amount = order.getAgreedPrice().subtract(
                    order.getDepositAmount() != null ? order.getDepositAmount() : BigDecimal.ZERO
            );

            if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Số tiền còn lại không hợp lệ");
            }

            if (order.getStatus() != OrderStatus.DEPOSIT_PAID) {
                throw new IllegalStateException("Đơn hàng phải ở trạng thái ĐÃ ĐẶT CỌC mới có thể thanh toán phần còn lại");
            }

            Session checkoutSession = stripeService.createCheckoutSession(amount, currency, orderId, false);

            Payment fullPaid = Payment.builder()
                    .order(order)
                    .amount(amount)
                    .currency("VND")
                    .method(PaymentMethod.STRIPE)
                    .status(PaymentStatus.PENDING)
                    .isDeposit(false)
                    .paidAt(null)
                    .build();

            paymentRepository.save(fullPaid);
            return checkoutSession.getUrl();
        } catch (StripeException e) {
            throw new RuntimeException("Stripe error: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Error processing payment: " + e.getMessage());
        }
    }

    public PaymentResponse createCashPayment(Long orderId, String currency) {
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new IllegalArgumentException("Order not found"));

            if (paymentRepository.findByOrderId(orderId).isPresent()) {
                throw new IllegalStateException("Payment already exists for this order");
            }

            if (order.getStatus() != OrderStatus.PENDING) {
                throw new IllegalStateException("Order is not in valid state for CASH payment");
            }

            BigDecimal amount = order.getAgreedPrice();

            if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Invalid order amount");
            }

            Payment payment = Payment.builder()
                    .order(order)
                    .amount(amount)
                    .currency(currency != null ? currency : "VND")
                    .method(PaymentMethod.CASH)
                    .status(PaymentStatus.PENDING)
                    .isDeposit(false)
                    .paidAt(null)
                    .build();

            paymentRepository.save(payment);

            return new PaymentResponse(
                    payment.getId(),
                    payment.getAmount(),
                    payment.getCurrency(),
                    payment.getStatus().name(),
                    payment.getMethod().name(),
                    payment.getOrder().getId().toString(),
                    payment.getCreatedAt() != null ? payment.getCreatedAt().toString() : null,
                    payment.getUpdatedAt() != null ? payment.getUpdatedAt().toString() : null);

        } catch (Exception e) {
            throw new RuntimeException("Error processing payment: " + e.getMessage());
        }
    }
}
