package com.bicycle.selling.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GhnWard {
    @JsonProperty("DistrictID")
    private int districtId;

    @JsonProperty("WardCode")
    private String wardCode;

    @JsonProperty("WardName")
    private String wardName;
}
