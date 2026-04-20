package com.bicycle.selling.repository;

import com.bicycle.selling.model.Dispute;
import com.bicycle.selling.model.enums.DisputeStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DisputeRepository extends JpaRepository<Dispute, Long> {

    Optional<Dispute> findByOrderId(Long orderId);

    boolean existsByOrderId(Long orderId);

    List<Dispute> findByStatus(DisputeStatus status);

    List<Dispute> findByOpenedById(Long userId);

    List<Dispute> findByHandledById(Long adminId);
}