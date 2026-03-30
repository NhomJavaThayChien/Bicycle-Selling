package com.bicycle.selling.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentDepositRequest {
    public Long orderId;
    public String currency;
}
