package com.bicycle.selling.repository;

import com.bicycle.selling.model.ListingImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ListingImageRepository extends JpaRepository<ListingImage, Long> {
    
    List<ListingImage> findByListingIdOrderByIsPrimaryDescUploadedAtAsc(Long listingId);
    
    void deleteByListingId(Long listingId);
}
