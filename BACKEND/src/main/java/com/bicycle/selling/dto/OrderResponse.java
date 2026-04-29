package com.bicycle.selling.dto;

import java.math.BigDecimal;

import com.bicycle.selling.model.enums.OrderStatus;

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
    private BigDecimal shippingFee;
    private OrderStatus status;

    public OrderResponse(Long id, Long buyerId, Long listingId, BigDecimal agreedPrice, BigDecimal shippingFee, String status) {
        this.id = id;
        this.buyerId = buyerId;
        this.listingId = listingId;
        this.agreedPrice = agreedPrice;
        this.shippingFee = shippingFee;
        this.status = OrderStatus.valueOf(status);
    }
}