package com.bicycle.selling.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import com.bicycle.selling.dto.UpdateProfileRequest;
import com.bicycle.selling.dto.UserPrivateResponse;
import com.bicycle.selling.dto.UserProfileResponse;
import com.bicycle.selling.service.UserService;
import com.bicycle.selling.service.ImageService;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "User Profile", description = "API quản lý hồ sơ người dùng")
public class UserController {

    private final UserService userService;
    private final ImageService imageService;

    @GetMapping("/users/{userId}/profile")
    @Operation(summary = "Xem hồ sơ người bán/mua (Public)")
    public ResponseEntity<UserProfileResponse> getUserProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserProfile(userId));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('BUYER', 'SELLER', 'ADMIN', 'INSPECTOR')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Xem hồ sơ cá nhân")
    public ResponseEntity<UserPrivateResponse> getMyProfile() {
        return ResponseEntity.ok(userService.getMyProfile());
    }

    @PutMapping("/me/profile")
    @PreAuthorize("hasAnyRole('BUYER', 'SELLER', 'ADMIN', 'INSPECTOR')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Cập nhật hồ sơ cá nhân")
    public ResponseEntity<UserPrivateResponse> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(request));
    }

    @PostMapping("/me/avatar")
    @PreAuthorize("hasAnyRole('BUYER', 'SELLER', 'ADMIN', 'INSPECTOR')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Upload ảnh đại diện")
    public ResponseEntity<Map<String, String>> uploadAvatar(@RequestParam("file") MultipartFile file) {
        try {
            String avatarUrl = imageService.uploadAvatar(file);
            userService.updateAvatar(avatarUrl);
            return ResponseEntity.ok(Map.of("avatarUrl", avatarUrl, "message", "Avatar updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
