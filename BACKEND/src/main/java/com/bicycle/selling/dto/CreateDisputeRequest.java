package com.bicycle.selling.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateDisputeRequest {

    @NotNull
    private Long orderId;

    @NotBlank
    private String reason;

    private String description;
    
    private String evidenceUrls;
}