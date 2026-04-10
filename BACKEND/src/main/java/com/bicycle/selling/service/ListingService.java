package com.bicycle.selling.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bicycle.selling.dto.ListingRequest;
import com.bicycle.selling.dto.ListingResponse;
import com.bicycle.selling.dto.ListingSearchRequest;
import com.bicycle.selling.exception.ResourceNotFoundException;
import com.bicycle.selling.exception.UnauthorizedAccessException;
import com.bicycle.selling.model.BicycleListing;
import com.bicycle.selling.model.Brand;
import com.bicycle.selling.model.Category;
import com.bicycle.selling.model.ListingImage;
import com.bicycle.selling.model.User;
import com.bicycle.selling.model.enums.BikeCondition;
import com.bicycle.selling.model.enums.ListingStatus;
import com.bicycle.selling.repository.BicycleListingRepository;
import com.bicycle.selling.repository.BrandRepository;
import com.bicycle.selling.repository.CategoryRepository;
import com.bicycle.selling.repository.ListingImageRepository;
import com.bicycle.selling.repository.UserRepository;
import com.bicycle.selling.repository.WishlistRepository;
import com.bicycle.selling.security.UserDetailsImpl;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ListingService {
    
    private final BicycleListingRepository listingRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ListingImageRepository imageRepository;
    private final WishlistRepository wishlistRepository;
    
    @Transactional
    public ListingResponse createListing(ListingRequest request) {
        UserDetailsImpl currentUser = getCurrentUser();
        
        // Get seller
        User seller = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Get brand and category
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found"));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        
        // Create listing
        BicycleListing listing = new BicycleListing();
        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setPrice(request.getPrice());
        listing.setSeller(seller);
        listing.setBrand(brand);
        listing.setCategory(category);
        listing.setCondition(normalizeConditionForPersistence(request.getCondition()));
        listing.setFrameSize(request.getFrameSize());
        listing.setFrameMaterial(request.getFrameMaterial());
        listing.setWheelSize(request.getWheelSize());
        listing.setBrakeType(request.getBrakeType());
        listing.setDrivetrain(request.getGearSystem());
        listing.setManufactureYear(request.getYearOfManufacture());
        listing.setColor(request.getColor());
        if (request.getWeight() != null) {
            listing.setWeightKg(java.math.BigDecimal.valueOf(request.getWeight()));
        }
        listing.setLocation(request.getLocation());
        listing.setAccessories(request.getAdditionalAccessories());
        listing.setReasonForSelling(request.getReasonForSelling());
        listing.setStatus(ListingStatus.PENDING_APPROVAL);
        listing.setCreatedAt(LocalDateTime.now());
        
        BicycleListing savedListing = listingRepository.save(listing);
        
        return mapToResponse(savedListing);
    }
    
    @Transactional
    public ListingResponse updateListing(Long id, ListingRequest request) {
        UserDetailsImpl currentUser = getCurrentUser();
        
        // Check if listing exists
        BicycleListing listing = listingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found"));
        
        // Check ownership — ADMIN được phép update bất kỳ listing nào
        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin && !listing.getSeller().getId().equals(currentUser.getId())) {
            throw new UnauthorizedAccessException("You don't have permission to update this listing");
        }
        
        // Get brand and category
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found"));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        
        // Update listing
        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setPrice(request.getPrice());
        listing.setBrand(brand);
        listing.setCategory(category);
        listing.setCondition(normalizeConditionForPersistence(request.getCondition()));
        listing.setFrameSize(request.getFrameSize());
        listing.setFrameMaterial(request.getFrameMaterial());
        listing.setWheelSize(request.getWheelSize());
        listing.setBrakeType(request.getBrakeType());
        listing.setDrivetrain(request.getGearSystem());
        listing.setManufactureYear(request.getYearOfManufacture());
        listing.setColor(request.getColor());
        if (request.getWeight() != null) {
            listing.setWeightKg(java.math.BigDecimal.valueOf(request.getWeight()));
        }
        listing.setLocation(request.getLocation());
        listing.setAccessories(request.getAdditionalAccessories());
        listing.setReasonForSelling(request.getReasonForSelling());
        listing.setUpdatedAt(LocalDateTime.now());
        
        // Reset to pending if was rejected
        if (listing.getStatus() == ListingStatus.REJECTED) {
            listing.setStatus(ListingStatus.PENDING_APPROVAL);
        }
        
        BicycleListing updatedListing = listingRepository.save(listing);
        
        return mapToResponse(updatedListing);
    }
    
    @Transactional
    public void deleteListing(Long id) {
        UserDetailsImpl currentUser = getCurrentUser();
        
        // Check if listing exists
        BicycleListing listing = listingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found"));
        
        // Check ownership — ADMIN được phép xoá bất kỳ listing nào
        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin && !listing.getSeller().getId().equals(currentUser.getId())) {
            throw new UnauthorizedAccessException("You don't have permission to delete this listing");
        }
        
        // Soft delete
        listing.setStatus(ListingStatus.HIDDEN);
        listing.setUpdatedAt(LocalDateTime.now());
        listingRepository.save(listing);
    }
    
    @Transactional(readOnly = true)
    public Page<ListingResponse> searchListings(ListingSearchRequest request) {
        Sort sort = request.getSortDir().equalsIgnoreCase("asc") 
                ? Sort.by(request.getSortBy()).ascending()
                : Sort.by(request.getSortBy()).descending();
        
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(), sort);
        
        Page<BicycleListing> listings = listingRepository.searchListings(
                request.getKeyword(),
                request.getBrandId(),
                request.getCategoryId(),
                request.getCondition(),
                request.getPriceMin(),
                request.getPriceMax(),
                request.getFrameSize(),
                pageable
        );
        
        return listings.map(this::mapToResponse);
    }
    
    @Transactional
    public ListingResponse getListingById(Long id) {
        BicycleListing listing = listingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found"));
        
        // Increment view count
        listing.setViewCount(listing.getViewCount() + 1);
        listingRepository.save(listing);
        
        return mapToResponse(listing);
    }
    
    @Transactional(readOnly = true)
    public List<ListingResponse> getMyListings() {
        UserDetailsImpl currentUser = getCurrentUser();
        
        List<BicycleListing> listings = listingRepository.findBySellerIdOrderByCreatedAtDesc(currentUser.getId());
        
        return listings.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public ListingResponse approveListing(Long id) {
        BicycleListing listing = listingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found"));
        
        listing.setStatus(ListingStatus.APPROVED);
        listing.setUpdatedAt(LocalDateTime.now());
        
        BicycleListing updatedListing = listingRepository.save(listing);
        
        // TODO: Send notification to seller
        
        return mapToResponse(updatedListing);
    }
    
    @Transactional
    public ListingResponse rejectListing(Long id, String reason) {
        BicycleListing listing = listingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found"));
        
        listing.setStatus(ListingStatus.REJECTED);
        listing.setRejectionReason(reason);
        listing.setUpdatedAt(LocalDateTime.now());
        
        BicycleListing updatedListing = listingRepository.save(listing);
        
        // TODO: Send notification to seller with reason
        
        return mapToResponse(updatedListing);
    }
    
    private ListingResponse mapToResponse(BicycleListing listing) {
        User seller = listing.getSeller();
        
        // Get images
        List<ListingImage> images = imageRepository.findByListingIdOrderByIsPrimaryDescUploadedAtAsc(listing.getId());
        List<String> imageUrls = images.stream()
                .map(ListingImage::getImageUrl)
                .collect(Collectors.toList());
        String primaryImageUrl = images.stream()
                .filter(ListingImage::isPrimary)
                .findFirst()
                .map(ListingImage::getImageUrl)
                .orElse(imageUrls.isEmpty() ? null : imageUrls.get(0));
        
        return ListingResponse.builder()
                .id(listing.getId())
                .title(listing.getTitle())
                .description(listing.getDescription())
                .price(listing.getPrice())
                .condition(listing.getCondition())
                .status(listing.getStatus())
                .inspectionStatus(listing.isInspected() ? com.bicycle.selling.model.enums.InspectionStatus.PASSED : null)
                .brandName(listing.getBrand() != null ? listing.getBrand().getName() : null)
                .categoryName(listing.getCategory() != null ? listing.getCategory().getName() : null)
                .frameSize(listing.getFrameSize())
                .frameMaterial(listing.getFrameMaterial())
                .wheelSize(listing.getWheelSize())
                .brakeType(listing.getBrakeType())
                .gearSystem(listing.getDrivetrain())
                .yearOfManufacture(listing.getManufactureYear())
                .color(listing.getColor())
                .weight(listing.getWeightKg() != null ? listing.getWeightKg().doubleValue() : null)
                .location(listing.getLocation())
                .additionalAccessories(listing.getAccessories())
                .reasonForSelling(listing.getReasonForSelling())
                .viewCount(listing.getViewCount())
                .likeCount((int) wishlistRepository.countByListingId(listing.getId()))
                .sellerId(seller.getId())
                .sellerUsername(seller.getUsername())
                .sellerFullName(seller.getFullName())
                .sellerReputation(seller.getReputationScore())
                .imageUrls(imageUrls)
                .primaryImageUrl(primaryImageUrl)
                .createdAt(listing.getCreatedAt())
                .updatedAt(listing.getUpdatedAt())
                .build();
    }
    
    private UserDetailsImpl getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated() || 
            authentication instanceof AnonymousAuthenticationToken) {
            throw new UnauthorizedAccessException("User is not authenticated");
        }
        
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof UserDetailsImpl)) {
            throw new UnauthorizedAccessException("Invalid authentication principal");
        }
        
        return (UserDetailsImpl) principal;
    }

    private BikeCondition normalizeConditionForPersistence(BikeCondition condition) {
        if (condition == BikeCondition.NEW) {
            // Backward-compatible write path for environments with legacy enum/check constraints.
            return BikeCondition.LIKE_NEW;
        }
        return condition;
    }
}
