package com.bicycle.selling.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.bicycle.selling.dto.CreateReviewRequest;
import com.bicycle.selling.dto.ReviewResponse;
import com.bicycle.selling.security.UserDetailsImpl;
import com.bicycle.selling.service.ReviewService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@AllArgsConstructor
@Validated
public class ReviewController {

    private final ReviewService reviewService;

    // Create review for an order
    @PostMapping("/orders/{orderId}")
    public ResponseEntity<?> createReview(
            @PathVariable Long orderId,
            @RequestBody @Validated CreateReviewRequest request,
            @AuthenticationPrincipal UserDetailsImpl user
    ) {
        try {
            CreateReviewResponse review = reviewService.createReview(user.getId(), orderId, request);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // get seller reviews
    @GetMapping("/sellers/{sellerId}")
    public ResponseEntity<?> getReviewsBySeller(
            @PathVariable Long sellerId,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size
    ) {
        try {
            List<ReviewResponse> reviews = reviewService.getReviewsBySellerId(sellerId, page, size);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}