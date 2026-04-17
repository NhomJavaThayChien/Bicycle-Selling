package com.bicycle.selling.infrastructure;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bicycle.selling.model.Order;
import com.bicycle.selling.model.Payment;
import com.bicycle.selling.model.enums.OrderStatus;
import com.bicycle.selling.model.enums.PaymentStatus;
import com.bicycle.selling.repository.OrderRepository;
import com.bicycle.selling.repository.PaymentRepository;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.stripe.model.Event;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentProcessorService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    @Transactional
    public void handlePaymentSuccess(Event event) {

        String session = event.getData().toJson();

        if (session == null) {
            System.out.println("Session Fail here!");
            return;
        }

        // Parse JSON
        JsonObject root = JsonParser.parseString(session).getAsJsonObject();
        JsonObject object = root.getAsJsonObject("object"); // payment_intent

        String paymentIntentId = object.get("id").getAsString();

        JsonObject metadata = object.getAsJsonObject("metadata");
        String orderIdStr = metadata.get("orderId").getAsString();
        String isDepositStr = metadata.get("isDeposit").getAsString();

        boolean isDeposit = Boolean.parseBoolean(isDepositStr);

        Long orderId = Long.parseLong(orderIdStr);

        System.out.println("OrderId: " + orderId);
        System.out.println("PaymentIntent: " + paymentIntentId);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Payment payment = paymentRepository.findByOrderIdForUpdate(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            System.out.println("Payment success is updated!");
            return;
        }
        payment.setStripePaymentIntentId(paymentIntentId);
        payment.setStripeMetadata(orderIdStr);
        payment.setPaidAt(LocalDateTime.now());

        payment.setStatus(PaymentStatus.SUCCESS);
        paymentRepository.save(payment);

        if (isDeposit) {
            order.setStatus(OrderStatus.DEPOSIT_PAID);
        } else {
            order.setStatus(OrderStatus.FULL_PAID);
        }
        orderRepository.save(order);
    }

    @Transactional
    public void handlePaymentFailed(Event event) {

        String session = event.getData().toJson();

        if (session == null) {
            System.out.println("Session Fail here!");
            return;
        }

        JsonObject root = JsonParser.parseString(session).getAsJsonObject();
        JsonObject object = root.getAsJsonObject("object");

        String paymentIntentId = object.get("id").getAsString();

        Payment payment = paymentRepository
                .findByStripePaymentIntentId(paymentIntentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setStatus(PaymentStatus.FAILED);

        paymentRepository.save(payment);

        System.out.println("Payment FAILED updated");
    }
}