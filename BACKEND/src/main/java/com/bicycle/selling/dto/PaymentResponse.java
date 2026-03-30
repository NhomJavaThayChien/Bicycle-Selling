package com.bicycle.selling.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentResponse {
    private Long id;
    private BigDecimal amount;
    private String currency;
    private String status;
    private String orderId;
    private String createdAt;
    private String updatedAt;
}
