package com.bicycle.selling.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bicycle.selling.infrastructure.StripeWebhookService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/webhook/stripe")
@RequiredArgsConstructor
public class StripeWebhookController {

    private final StripeWebhookService stripeWebhookService;

    @PostMapping
    public ResponseEntity<String> handleStripeWebhook(
            HttpServletRequest request,
            @RequestHeader(value = "Stripe-Signature", required = false) String sigHeader) {
        String payload;
        try {
            payload = request.getReader()
                    .lines()
                    .collect(java.util.stream.Collectors.joining("\n"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Read error");
        }

        try {
            stripeWebhookService.handleEvent(payload, sigHeader);
            return ResponseEntity.ok("ok");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(400).body("error");
        }
    }
}