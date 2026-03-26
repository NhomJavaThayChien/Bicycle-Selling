package com.bicycle.selling.repository;

import com.bicycle.selling.model.Order;
import com.bicycle.selling.model.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByBuyerId(Long buyerId);

    List<Order> findByStatus(OrderStatus status);

    Order findByListingId(Long id);
}