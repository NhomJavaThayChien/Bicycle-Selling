package com.bicycle.selling.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GhnDistrict {
    @JsonProperty("ProvinceID")
    private int provinceId;

    @JsonProperty("DistrictID")
    private int districtId;

    @JsonProperty("DistrictName")
    private String districtName;
}
