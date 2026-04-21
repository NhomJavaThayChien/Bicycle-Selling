package com.bicycle.selling.dto;

import com.bicycle.selling.model.enums.UserRole;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPrivateResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phoneNumber;
    private String address;
    private String avatarUrl;
    private UserRole role;
    private Double reputationScore;
    private Integer totalReviews;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
}
