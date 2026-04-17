package com.bicycle.selling.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateShippingOrderRequest {
    private Long orderId;
    private int fromDistrictId;
    private String fromWardCode;
    private int toDistrictId;
    private String toWardCode;
    private String toProvinceName;
    private String toDistrictName;
    private String toWardName;
}
