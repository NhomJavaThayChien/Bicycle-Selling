package com.bicycle.selling.dto;

import lombok.Data;

@Data
public class GhnCreateOrderRequest {

    private String token;
    private Integer shop_id;

    private String to_name;
    private String to_phone;
    private String to_address;
    private String to_ward_name;
    private String to_district_name;
    private String to_province_name;

    private Integer service_type_id;
    private Integer payment_type_id;
    private String required_note;

    private Integer weight;
    private Integer length;
    private Integer width;
    private Integer height;

    private Integer cod_amount;
}