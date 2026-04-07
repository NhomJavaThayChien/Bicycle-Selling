package com.bicycle.selling.service;

import com.bicycle.selling.dto.ListingResponse;
import com.bicycle.selling.exception.ResourceNotFoundException;
import com.bicycle.selling.exception.UnauthorizedAccessException;
import com.bicycle.selling.model.BicycleListing;
import com.bicycle.selling.model.ListingImage;
import com.bicycle.selling.model.User;
import com.bicycle.selling.model.Wishlist;
import com.bicycle.selling.model.enums.InspectionStatus;
import com.bicycle.selling.repository.BicycleListingRepository;
import com.bicycle.selling.repository.ListingImageRepository;
import com.bicycle.selling.repository.UserRepository;
import com.bicycle.selling.repository.WishlistRepository;
import com.bicycle.selling.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final BicycleListingRepository listingRepository;
    private final ListingImageRepository imageRepository;

    @Transactional
    public void addToWishlist(Long listingId) {
        UserDetailsImpl currentUser = getCurrentUser();

        if (wishlistRepository.existsByUserIdAndListingId(currentUser.getId(), listingId)) {
            return;
        }

        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        BicycleListing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found"));

        Wishlist wishlist = Wishlist.builder()
                .user(user)
                .listing(listing)
                .savedAt(LocalDateTime.now())
                .build();

        wishlistRepository.save(wishlist);
    }

    @Transactional
    public void removeFromWishlist(Long listingId) {
        UserDetailsImpl currentUser = getCurrentUser();
        wishlistRepository.deleteByUserIdAndListingId(currentUser.getId(), listingId);
    }

    @Transactional(readOnly = true)
    public List<ListingResponse> getMyWishlist() {
        UserDetailsImpl currentUser = getCurrentUser();

        return wishlistRepository.findByUserIdOrderBySavedAtDesc(currentUser.getId())
                .stream()
                .map(Wishlist::getListing)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ListingResponse mapToResponse(BicycleListing listing) {
        User seller = listing.getSeller();

        List<ListingImage> images = imageRepository.findByListingIdOrderByIsPrimaryDescUploadedAtAsc(listing.getId());
        List<String> imageUrls = images.stream().map(ListingImage::getImageUrl).collect(Collectors.toList());
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
                .inspectionStatus(listing.isInspected() ? InspectionStatus.PASSED : null)
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
                .likeCount(0)
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
}
