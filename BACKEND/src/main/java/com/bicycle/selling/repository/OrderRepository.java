package com.bicycle.selling.repository;

import com.bicycle.selling.dto.OrderResponse;
import com.bicycle.selling.model.Order;
import com.bicycle.selling.model.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByStatus(OrderStatus status);

    Order findByListingId(Long id);

    @Query("""
                SELECT new com.bicycle.selling.dto.OrderResponse(
                    o.id,
                    o.buyer.id,
                    o.listing.id,
                    o.agreedPrice,
                    o.status
                )
                FROM Order o
                WHERE o.buyer.id = :userId
            """)
    List<OrderResponse> findByBuyerId(Long userId);
}