package com.bicycle.selling.controller;

import com.bicycle.selling.dto.ListingRequest;
import com.bicycle.selling.dto.ListingResponse;
import com.bicycle.selling.dto.ListingSearchRequest;
import com.bicycle.selling.service.ImageService;
import com.bicycle.selling.service.ListingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Listings", description = "API quản lý tin đăng bán xe")
public class ListingController {
    
    private final ListingService listingService;
    private final ImageService imageService;
    
    // ========== PUBLIC ENDPOINTS ==========
    
    @GetMapping("/listings")
    @Operation(summary = "Tìm kiếm & lọc xe đạp", description = "Public API - không cần đăng nhập")
    public ResponseEntity<Page<ListingResponse>> searchListings(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long brandId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String condition,
            @RequestParam(required = false) String priceMin,
            @RequestParam(required = false) String priceMax,
            @RequestParam(required = false) String frameSize,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        ListingSearchRequest request = new ListingSearchRequest();
        request.setKeyword(keyword);
        request.setBrandId(brandId);
        request.setCategoryId(categoryId);
        request.setPriceMin(priceMin != null ? new java.math.BigDecimal(priceMin) : null);
        request.setPriceMax(priceMax != null ? new java.math.BigDecimal(priceMax) : null);
        request.setFrameSize(frameSize);
        request.setPage(page);
        request.setSize(size);
        request.setSortBy(sortBy);
        request.setSortDir(sortDir);
        
        if (condition != null) {
            request.setCondition(com.bicycle.selling.model.enums.BikeCondition.valueOf(condition));
        }
        
        Page<ListingResponse> listings = listingService.searchListings(request);
        return ResponseEntity.ok(listings);
    }
    
    @GetMapping("/listings/{id}")
    @Operation(summary = "Xem chi tiết xe đạp", description = "Public API - tăng viewCount")
    public ResponseEntity<ListingResponse> getListingById(@PathVariable Long id) {
        ListingResponse listing = listingService.getListingById(id);
        return ResponseEntity.ok(listing);
    }
    
    // ========== SELLER ENDPOINTS ==========
    
    @PostMapping("/seller/listings")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Đăng tin bán xe", description = "Seller tạo listing mới")
    public ResponseEntity<ListingResponse> createListing(@Valid @RequestBody ListingRequest request) {
        ListingResponse listing = listingService.createListing(request);
        return ResponseEntity.ok(listing);
    }
    
    @PutMapping("/seller/listings/{id}")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Sửa tin đăng", description = "Seller cập nhật listing của mình")
    public ResponseEntity<ListingResponse> updateListing(
            @PathVariable Long id,
            @Valid @RequestBody ListingRequest request
    ) {
        ListingResponse listing = listingService.updateListing(id, request);
        return ResponseEntity.ok(listing);
    }
    
    @DeleteMapping("/seller/listings/{id}")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Xóa tin đăng", description = "Seller xóa (soft delete) listing của mình")
    public ResponseEntity<Void> deleteListing(@PathVariable Long id) {
        listingService.deleteListing(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/seller/listings")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Danh sách tin đăng của tôi", description = "Seller xem tất cả listings của mình")
    public ResponseEntity<List<ListingResponse>> getMyListings() {
        List<ListingResponse> listings = listingService.getMyListings();
        return ResponseEntity.ok(listings);
    }
    
    @PostMapping("/seller/listings/{id}/images")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Upload ảnh cho listing", description = "Upload tối đa 10 ảnh, mỗi ảnh max 10MB")
    public ResponseEntity<List<String>> uploadImages(
            @PathVariable Long id,
            @RequestParam("files") List<MultipartFile> files
    ) {
        try {
            List<String> imageUrls = imageService.uploadImages(id, files);
            return ResponseEntity.ok(imageUrls);
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/seller/listings/{listingId}/images/{imageId}")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Xóa ảnh", description = "Seller xóa ảnh của listing")
    public ResponseEntity<Void> deleteImage(
            @PathVariable Long listingId,
            @PathVariable Long imageId
    ) {
        imageService.deleteImage(listingId, imageId);
        return ResponseEntity.ok().build();
    }
    
    // ========== ADMIN ENDPOINTS ==========
    
    @PatchMapping("/admin/listings/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Duyệt tin đăng", description = "Admin duyệt listing")
    public ResponseEntity<ListingResponse> approveListing(@PathVariable Long id) {
        ListingResponse listing = listingService.approveListing(id);
        return ResponseEntity.ok(listing);
    }
    
    @PatchMapping("/admin/listings/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Từ chối tin đăng", description = "Admin từ chối listing")
    public ResponseEntity<ListingResponse> rejectListing(
            @PathVariable Long id,
            @RequestParam(required = false) String reason
    ) {
        ListingResponse listing = listingService.rejectListing(id, reason);
        return ResponseEntity.ok(listing);
    }
}
