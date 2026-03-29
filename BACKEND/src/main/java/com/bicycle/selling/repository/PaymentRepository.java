package com.bicycle.selling.repository;

import com.bicycle.selling.model.Payment;

import jakarta.persistence.LockModeType;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment findByOrderId(Long orderId);
    List<Payment> findByOrder_Buyer_Id(Long userId);
    Optional<Payment> findByStripePaymentIntentId(String stripePaymentIntentId);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT l FROM BicycleListing l WHERE l.id = :id")
    Payment findByIdForUpdate(@Param("id") Long id);
}
