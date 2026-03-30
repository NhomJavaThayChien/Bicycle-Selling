package com.bicycle.selling.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.bicycle.selling.dto.CreateReviewRequest;
import com.bicycle.selling.model.Review;
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
    public ResponseEntity<Review> createReview(
            @PathVariable Long orderId,
            @RequestBody @Validated CreateReviewRequest request,
            @AuthenticationPrincipal UserDetailsImpl user
    ) {
        Review review = reviewService.createReviewWithRetry(user.getId(), orderId, request);
        return ResponseEntity.ok(review);
    }

    // get seller reviews
    @GetMapping("/sellers/{sellerId}")
    public ResponseEntity<List<Review>> getReviewsBySeller(
            @PathVariable Long sellerId,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size
    ) {
        List<Review> reviews = reviewService.getReviewsBySellerId(sellerId, page, size);
        return ResponseEntity.ok(reviews);
    }
}