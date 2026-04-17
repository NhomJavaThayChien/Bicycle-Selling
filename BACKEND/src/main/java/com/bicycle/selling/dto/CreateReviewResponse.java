package com.bicycle.selling.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreateReviewResponse {
    private Long id;
    private int rating;
    private String comment;
}