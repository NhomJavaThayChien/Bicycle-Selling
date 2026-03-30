package com.bicycle.selling.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bicycle.selling.dto.CreateReviewRequest;
import com.bicycle.selling.model.Order;
import com.bicycle.selling.model.Review;
import com.bicycle.selling.model.User;
import com.bicycle.selling.model.enums.OrderStatus;
import com.bicycle.selling.repository.OrderRepository;
import com.bicycle.selling.repository.ReviewRepository;
import com.bicycle.selling.repository.UserRepository;

import jakarta.persistence.OptimisticLockException;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    // Retry to handle OptimisticLockException
    @Transactional
    public Review createReviewWithRetry(Long reviewerId, Long orderId, CreateReviewRequest request) {
        int retries = 3;
        while (retries > 0) {
            try {
                return createReview(reviewerId, orderId, request);
            } catch (OptimisticLockException e) {
                retries--;
                if (retries == 0) {
                    throw new RuntimeException(
                            "Could not update seller rating due to concurrent reviews. Please try again.");
                }
            }
        }
        throw new RuntimeException("Unexpected error");
    }

    @Transactional
    public Review createReview(Long reviewerId, Long orderId, CreateReviewRequest request) {

        // 1. Find order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // 2. Check buyer = reviewer
        if (!order.getBuyer().getId().equals(reviewerId)) {
            throw new RuntimeException("You are not allowed to review this order");
        }

        // 3. Check order completed
        if (order.getStatus() != OrderStatus.COMPLETED) {
            throw new RuntimeException("Order not completed yet");
        }

        // 4. Check already reviewed
        if (reviewRepository.existsByOrderId(orderId)) {
            throw new RuntimeException("Order already reviewed");
        }

        User reviewer = order.getBuyer();
        User seller = order.getListing().getSeller();

        // 5. Prevent self-review
        if (reviewer.getId().equals(seller.getId())) {
            throw new RuntimeException("Reviewer cannot be seller");
        }

        // 6. Build review
        Review review = Review.builder()
                .rating(request.getRating())
                .comment(request.getComment())
                .accuracyRating(request.getAccuracyRating())
                .communicationRating(request.getCommunicationRating())
                .reviewer(reviewer)
                .seller(seller)
                .order(order)
                .build();

        Review saved = reviewRepository.save(review);

        // 7. Update seller rating
        final double currentAvg = seller.getReputationScore();
        final long currentCount = seller.getTotalReviews();
        final double newAvg = (currentAvg * currentCount + request.getRating()) / (currentCount + 1);
        seller.setReputationScore(newAvg);
        seller.setTotalReviews(seller.getTotalReviews() + 1);
        userRepository.save(seller);

        return saved;
    }

    public List<Review> getReviewsBySellerId(Long sellerId, Integer page, Integer size) {
        return reviewRepository.findBySellerId(sellerId, PageRequest.of(page, size)).getContent();
    }
}
