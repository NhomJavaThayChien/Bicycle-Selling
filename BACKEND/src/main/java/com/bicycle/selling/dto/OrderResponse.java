package com.bicycle.selling.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {
    private Long id;
    private Long buyerId;
    private Long listingId;
    private BigDecimal agreedPrice;
    private String status;
}