package com.bicycle.selling.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class DisputeResponse {

    private Long id;

    private Long orderId;

    private Long openedBy;
    private Long handledBy;

    private String reason;
    private String description;
    private String evidenceUrls;

    private String status;
    private String resolution;

    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}