package com.bicycle.selling.repository;

import com.bicycle.selling.model.BicycleListing;
import com.bicycle.selling.model.enums.ListingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BicycleListingRepository extends JpaRepository<BicycleListing, Long> {

    List<BicycleListing> findByStatus(ListingStatus status);

    List<BicycleListing> findBySellerId(Long sellerId);

    Optional<BicycleListing> findByIdAndStatus(Long id, ListingStatus status);

    Optional<BicycleListing> findById(Long id);
}