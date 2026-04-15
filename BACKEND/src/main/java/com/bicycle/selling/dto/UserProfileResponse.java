package com.bicycle.selling.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String fullName;
    private String avatarUrl;
    private Double reputationScore;
    private Integer totalReviews;
    private LocalDateTime memberSince;
}
