package com.bicycle.selling.repository;

import com.bicycle.selling.model.Order;
import com.bicycle.selling.model.Review;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    boolean existsByOrderId(Long orderId);

    Page<Review> findBySellerId(Long sellerId, Pageable pageable);

    Optional<Order> findBySellerId(Long id);
}