package com.bicycle.selling.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class InspectionResponse {

    private Long id;

    private Long listingId;
    private Long inspectorId;

    private Double overallScore;
    private String status;

    private String summary;
    private String recommendations;

    private LocalDateTime inspectedAt;
    private LocalDateTime createdAt;
}