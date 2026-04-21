package com.bicycle.selling.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.bicycle.selling.dto.CreateReviewRequest;
import com.bicycle.selling.dto.CreateReviewResponse;
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
    public CreateReviewResponse createReview(
            @PathVariable Long orderId,
            @RequestBody @Validated CreateReviewRequest request,
            @AuthenticationPrincipal UserDetailsImpl user
    ) {
        return reviewService.createReview(user.getId(), orderId, request);
    }

    // get seller reviews
    @GetMapping("/sellers/{sellerId}")
    public List<ReviewResponse> getReviewsBySeller(
            @PathVariable Long sellerId,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size
    ) {
        return reviewService.getReviewsBySellerId(sellerId, page, size);
    }
}