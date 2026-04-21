package com.bicycle.selling.dto;

import lombok.Data;

@Data
public class ShippingRequest {
    private Long listingId;
    private int fromDistrictId;
    private String fromWardCode;
    private int toDistrictId;
    private String toWardCode;
}