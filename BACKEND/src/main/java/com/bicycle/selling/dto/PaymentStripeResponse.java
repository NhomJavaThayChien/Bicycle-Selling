package com.bicycle.selling.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentStripeResponse {
    private String checkoutSession;
}
