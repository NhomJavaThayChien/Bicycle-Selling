package com.bicycle.selling.controller;

import com.bicycle.selling.dto.PaymentDepositRequest;
import com.bicycle.selling.dto.PaymentDepositResponse;
import com.bicycle.selling.dto.PaymentResponse;
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
    public PaymentDepositResponse createDepositPayment(@RequestBody PaymentDepositRequest request) {
        if (request.currency == null) {
            request.currency = "vnd";
        }
        String checkoutSession = paymentService.PaymentDeposit(request.orderId, request.currency);
        PaymentDepositResponse response = new PaymentDepositResponse(checkoutSession);
        return response;
    }

    @GetMapping()
    public List<PaymentResponse> getPaymentsByUserId(@AuthenticationPrincipal UserDetailsImpl user) {
        return paymentService.getPaymentsByUserId(user.getId());
    }
}
