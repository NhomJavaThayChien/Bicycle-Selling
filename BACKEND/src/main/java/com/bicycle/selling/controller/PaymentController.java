package com.bicycle.selling.controller;

import com.bicycle.selling.dto.PaymentDepositRequest;
import com.bicycle.selling.dto.PaymentDepositResponse;

import org.springframework.http.ResponseEntity;
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
}
