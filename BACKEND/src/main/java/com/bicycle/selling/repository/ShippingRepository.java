package com.bicycle.selling.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bicycle.selling.model.ShippingOrder;

public interface ShippingRepository extends JpaRepository<ShippingOrder, Long> {
    
}
