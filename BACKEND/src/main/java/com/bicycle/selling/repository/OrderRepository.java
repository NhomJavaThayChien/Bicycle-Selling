package com.bicycle.selling.repository;

import com.bicycle.selling.dto.OrderResponse;
import com.bicycle.selling.model.Order;
import com.bicycle.selling.model.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
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

    @Query("""
                SELECT new com.bicycle.selling.dto.OrderResponse(
                    o.id,
                    o.buyer.id,
                    o.listing.id,
                    o.agreedPrice,
                    o.status
                )
                FROM Order o
                WHERE o.listing.seller.id = :sellerId
            """)
    List<OrderResponse> findByListingSellerId(Long sellerId);

    @Query("""
                SELECT COALESCE(SUM(o.agreedPrice), 0)
                FROM Order o
                WHERE o.status = com.bicycle.selling.model.enums.OrderStatus.COMPLETED
            """)
    Double getTotalRevenue();

    @Query("""
                SELECT FUNCTION('DATE', o.createdAt) as date, COUNT(o) as total
                FROM Order o
                GROUP BY FUNCTION('DATE', o.createdAt)
                ORDER BY date
            """)
    List<Object[]> getOrdersPerDay();

    @Query("""
                SELECT FUNCTION('DATE', o.createdAt) as date, SUM(o.agreedPrice)
                FROM Order o
                WHERE o.status = com.bicycle.selling.model.enums.OrderStatus.COMPLETED
                GROUP BY FUNCTION('DATE', o.createdAt)
                ORDER BY date
            """)
    List<Object[]> getRevenuePerDay();
}