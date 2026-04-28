package com.bicycle.selling.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SubmitInspectionRequest {

    @Min(1) @Max(10)
    private Integer frameScore;

    private String frameNote;

    @Min(1) @Max(10)
    private Integer brakeScore;

    private String brakeNote;

    @Min(1) @Max(10)
    private Integer drivetrainScore;

    private String drivetrainNote;

    @Min(1) @Max(10)
    private Integer wheelsScore;

    private String wheelsNote;

    @Min(1) @Max(10)
    private Integer handlebarSaddleScore;

    private String handlebarSaddleNote;

    private String summary;
    private String recommendations;
}