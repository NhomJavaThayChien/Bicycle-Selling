package com.bicycle.selling.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateOrderRequest {
    // Order info
    private Long listingId;
    private BigDecimal agreedPrice;
    private BigDecimal depositAmount;
    private BigDecimal shippingFee;
    private String note;
    private String shippingAddress;
}