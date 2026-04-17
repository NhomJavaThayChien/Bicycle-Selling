package com.bicycle.selling.controller;

import com.bicycle.selling.dto.PaymentRequest;
import com.bicycle.selling.dto.PaymentResponse;
import com.bicycle.selling.dto.PaymentStripeResponse;
import com.bicycle.selling.security.UserDetailsImpl;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bicycle.selling.service.PaymentService;

import org.springframework.web.bind.annotation.RequestBody;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    final PaymentService paymentService;

    @PostMapping("/deposit")
    public PaymentStripeResponse createDepositPayment(@RequestBody PaymentRequest request) {
        if (request.currency == null) {
            request.currency = "vnd";
        }
        String checkoutSession = paymentService.PaymentDeposit(request.orderId, request.currency);
        PaymentStripeResponse response = new PaymentStripeResponse(checkoutSession);
        return response;
    }

    @PostMapping("/full-paid")
    public PaymentStripeResponse createFullPayment(@RequestBody PaymentRequest request) {
        if (request.currency == null) {
            request.currency = "vnd";
        }
        String checkoutSession = paymentService.fullPayment(request.orderId, request.currency);
        PaymentStripeResponse response = new PaymentStripeResponse(checkoutSession);
        return response;
    }

    @PostMapping("/cash")
    public PaymentResponse createCashPayment(@RequestBody PaymentRequest request) {
        if (request.currency == null) {
            request.currency = "vnd";
        }
        PaymentResponse response = paymentService.createCashPayment(request.orderId, request.currency);
        return response;
    }

    @GetMapping()
    public List<PaymentResponse> getPaymentsByUserId(@AuthenticationPrincipal UserDetailsImpl user) {
        return paymentService.getPaymentsByUserId(user.getId());
    }
}
