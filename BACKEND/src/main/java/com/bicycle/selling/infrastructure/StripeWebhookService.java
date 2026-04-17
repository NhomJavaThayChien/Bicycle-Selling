package com.bicycle.selling.infrastructure;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.stripe.model.Event;
import com.stripe.net.Webhook;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StripeWebhookService {

    private final PaymentProcessorService paymentProcessorService;

    // private final String endpointSecret = "whsec_xxx";
    @Value("${stripe.endpoint.secret}")
    private String endpointSecret;

    public void handleEvent(String payload, String sigHeader) {
        Event event = verifyAndConstructEvent(payload, sigHeader);
        System.out.println("Event type: " + event.getType());
        switch (event.getType()) {
            case "payment_intent.succeeded":
                paymentProcessorService.handlePaymentSuccess(event);
                break;

            case "payment_intent.payment_failed":
                paymentProcessorService.handlePaymentFailed(event);
                break;

            default:
                return;
        }
    }

    // Verify
    private Event verifyAndConstructEvent(String payload, String sigHeader) {
        try {
            return Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (Exception e) {
            System.out.println("VERIFY FAIL");
            System.out.println("SECRET: " + endpointSecret);
            System.out.println("SIG: " + sigHeader);
            throw new RuntimeException("Invalid Stripe webhook", e);
        }
    }
}