package com.bicycle.selling.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GhnProvince {

    @JsonProperty("ProvinceID")
    private int provinceId;

    @JsonProperty("ProvinceName")
    private String provinceName;
}