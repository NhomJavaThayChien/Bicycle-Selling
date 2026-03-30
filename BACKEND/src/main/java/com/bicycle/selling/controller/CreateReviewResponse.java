package com.bicycle.selling.controller;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreateReviewResponse {
    private Long id;
    private int rating;
    private String comment;
}