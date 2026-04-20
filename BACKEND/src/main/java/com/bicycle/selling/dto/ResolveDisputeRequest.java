package com.bicycle.selling.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResolveDisputeRequest {

    @NotBlank
    private String resolution;

    private boolean acceptBuyer; 
}