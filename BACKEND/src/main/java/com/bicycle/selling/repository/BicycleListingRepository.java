package com.bicycle.selling.repository;
import com.bicycle.selling.model.BicycleListing;
import com.bicycle.selling.model.enums.BikeCondition;
import com.bicycle.selling.model.enums.ListingStatus;

import jakarta.persistence.LockModeType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface BicycleListingRepository extends JpaRepository<BicycleListing, Long> {
    
    // Find by seller
    List<BicycleListing> findBySellerIdOrderByCreatedAtDesc(Long sellerId);
    
    // Find by status
    Page<BicycleListing> findByStatus(ListingStatus status, Pageable pageable);
    
    // Find active listings
    Page<BicycleListing> findByStatusOrderByCreatedAtDesc(ListingStatus status, Pageable pageable);
    
    // Search with filters
    @Query("SELECT l FROM BicycleListing l WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR LOWER(l.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(l.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:brandId IS NULL OR l.brand.id = :brandId) " +
           "AND (:categoryId IS NULL OR l.category.id = :categoryId) " +
           "AND (:condition IS NULL OR l.condition = :condition) " +
           "AND (:priceMin IS NULL OR l.price >= :priceMin) " +
           "AND (:priceMax IS NULL OR l.price <= :priceMax) " +
           "AND (:frameSize IS NULL OR :frameSize = '' OR l.frameSize = :frameSize) " +
           "AND l.status = 'APPROVED'")
    Page<BicycleListing> searchListings(
            @Param("keyword") String keyword,
            @Param("brandId") Long brandId,
            @Param("categoryId") Long categoryId,
            @Param("condition") BikeCondition condition,
            @Param("priceMin") BigDecimal priceMin,
            @Param("priceMax") BigDecimal priceMax,
            @Param("frameSize") String frameSize,
            Pageable pageable
    );
    
    // Find by ID and seller (for ownership check)
    Optional<BicycleListing> findByIdAndSellerId(Long id, Long sellerId);
    List<BicycleListing> findByStatus(ListingStatus status);

    List<BicycleListing> findBySellerId(Long sellerId);

    Optional<BicycleListing> findByIdAndStatus(Long id, ListingStatus status);

    Optional<BicycleListing> findById(Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT l FROM BicycleListing l WHERE l.id = :id")
    Optional<BicycleListing> findByIdForUpdate(@Param("id") Long id);
}
