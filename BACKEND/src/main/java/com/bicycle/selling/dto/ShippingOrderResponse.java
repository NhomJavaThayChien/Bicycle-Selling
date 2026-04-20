package com.bicycle.selling.dto;

import com.bicycle.selling.model.ShippingOrder;
import com.bicycle.selling.model.enums.ShippingStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ShippingOrderResponse {

    private Long id;
    private String ghnOrderCode;
    private BigDecimal shippingFee;
    private BigDecimal codAmount;
    private ShippingStatus status;

    private String recipientName;
    private String recipientPhone;
    private String recipientAddress;

    private Long orderId;

    public static ShippingOrderResponse from(ShippingOrder entity) {
        return ShippingOrderResponse.builder()
                .id(entity.getId())
                .ghnOrderCode(entity.getGhnOrderCode())
                .shippingFee(entity.getShippingFee())
                .codAmount(entity.getCodAmount())
                .status(entity.getStatus())

                .recipientName(entity.getRecipientName())
                .recipientPhone(entity.getRecipientPhone())
                .recipientAddress(entity.getRecipientAddress())

                .orderId(entity.getOrder() != null ? entity.getOrder().getId() : null)

                .build();
    }
}