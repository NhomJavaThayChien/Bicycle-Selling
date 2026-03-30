package com.bicycle.selling.controller;

import com.bicycle.selling.dto.PaymentDepositRequest;
import com.bicycle.selling.dto.PaymentDepositResponse;
import com.bicycle.selling.security.UserDetailsImpl;

import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> createDepositPayment(@RequestBody PaymentDepositRequest request) {
        try {
            System.out.println("Received request to create deposit payment for orderId: " + request.orderId);
            if(request.currency == null) {
                request.currency = "vnd";
            }
            String checkoutSession = paymentService.PaymentDeposit(request.orderId, request.currency);
            PaymentDepositResponse response = new PaymentDepositResponse(checkoutSession);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating deposit payment: " + e.getMessage());
        }
    }

    @GetMapping()
    public ResponseEntity<?> getPaymentsByUserId(@AuthenticationPrincipal UserDetailsImpl user) {
        try {
            return ResponseEntity.ok(paymentService.getPaymentsByUserId(user.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving payments: " + e.getMessage());
        }
    }
}
