package com.bicycle.selling.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateReviewRequest {

    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;

    private String comment;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer accuracyRating;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer communicationRating;
}