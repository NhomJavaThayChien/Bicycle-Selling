package com.bicycle.selling.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.AnonymousAuthenticationToken;

import com.bicycle.selling.dto.UpdateProfileRequest;
import com.bicycle.selling.dto.UserPrivateResponse;
import com.bicycle.selling.dto.UserProfileResponse;
import com.bicycle.selling.model.User;
import com.bicycle.selling.repository.UserRepository;
import com.bicycle.selling.security.UserDetailsImpl;
import com.bicycle.selling.exception.ResourceNotFoundException;
import com.bicycle.selling.exception.UnauthorizedAccessException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public UserProfileResponse getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return UserProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .avatarUrl(user.getAvatarUrl())
                .reputationScore(user.getReputationScore())
                .totalReviews(user.getTotalReviews())
                .memberSince(user.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public UserPrivateResponse getMyProfile() {
        UserDetailsImpl currentUser = getCurrentUser();
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return UserPrivateResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhone())
                .address(user.getAddress())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole())
                .reputationScore(user.getReputationScore())
                .totalReviews(user.getTotalReviews())
                .createdAt(user.getCreatedAt())
                .lastLogin(user.getLastLogin())
                .build();
    }

    @Transactional
    public UserPrivateResponse updateProfile(UpdateProfileRequest request) {
        UserDetailsImpl currentUser = getCurrentUser();
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhone(request.getPhoneNumber());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }

        User updatedUser = userRepository.save(user);

        return UserPrivateResponse.builder()
                .id(updatedUser.getId())
                .username(updatedUser.getUsername())
                .email(updatedUser.getEmail())
                .fullName(updatedUser.getFullName())
                .phoneNumber(updatedUser.getPhone())
                .address(updatedUser.getAddress())
                .avatarUrl(updatedUser.getAvatarUrl())
                .role(updatedUser.getRole())
                .reputationScore(updatedUser.getReputationScore())
                .totalReviews(updatedUser.getTotalReviews())
                .createdAt(updatedUser.getCreatedAt())
                .lastLogin(updatedUser.getLastLogin())
                .build();
    }

    @Transactional
    public String updateAvatar(String avatarUrl) {
        UserDetailsImpl currentUser = getCurrentUser();
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        user.setAvatarUrl(avatarUrl);
        userRepository.save(user);
        
        return avatarUrl;
    }

    private UserDetailsImpl getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated() || 
            authentication instanceof AnonymousAuthenticationToken) {
            throw new UnauthorizedAccessException("User is not authenticated");
        }
        
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof UserDetailsImpl)) {
            throw new UnauthorizedAccessException("Invalid authentication principal");
        }
        
        return (UserDetailsImpl) principal;
    }
}
