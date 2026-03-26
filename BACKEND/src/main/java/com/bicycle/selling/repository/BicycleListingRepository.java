package com.bicycle.selling.repository;

import com.bicycle.selling.model.BicycleListing;
import com.bicycle.selling.model.enums.ListingStatus;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BicycleListingRepository extends JpaRepository<BicycleListing, Long> {

    List<BicycleListing> findByStatus(ListingStatus status);

    List<BicycleListing> findBySellerId(Long sellerId);

    Optional<BicycleListing> findByIdAndStatus(Long id, ListingStatus status);

    Optional<BicycleListing> findById(Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT l FROM BicycleListing l WHERE l.id = :id")
    Optional<BicycleListing> findByIdForUpdate(@Param("id") Long id);
}