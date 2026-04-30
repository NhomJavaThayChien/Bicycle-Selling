package com.bicycle.selling.repository;

import com.bicycle.selling.model.Review;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    boolean existsByOrderId(Long orderId);

    Page<Review> findBySellerId(Long sellerId, Pageable pageable);

    /** Trả về danh sách order_id mà reviewer đã đánh giá */
    @Query("SELECT r.order.id FROM Review r WHERE r.reviewer.id = :reviewerId AND r.order IS NOT NULL")
    List<Long> findReviewedOrderIdsByReviewerId(@Param("reviewerId") Long reviewerId);
}