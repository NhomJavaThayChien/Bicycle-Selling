package com.bicycle.selling.controller;

import com.bicycle.selling.dto.ListingResponse;
import com.bicycle.selling.service.WishlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buyer/wishlist")
@RequiredArgsConstructor
@Tag(name = "Wishlist", description = "API quan ly danh sach yeu thich")
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    @PreAuthorize("hasAnyRole('BUYER', 'ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Danh sach wishlist cua toi")
    public ResponseEntity<List<ListingResponse>> getMyWishlist() {
        return ResponseEntity.ok(wishlistService.getMyWishlist());
    }

    @PostMapping("/{listingId}")
    @PreAuthorize("hasAnyRole('BUYER', 'ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Them listing vao wishlist")
    public ResponseEntity<Void> addToWishlist(@PathVariable Long listingId) {
        wishlistService.addToWishlist(listingId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{listingId}")
    @PreAuthorize("hasAnyRole('BUYER', 'ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Xoa listing khoi wishlist")
    public ResponseEntity<Void> removeFromWishlist(@PathVariable Long listingId) {
        wishlistService.removeFromWishlist(listingId);
        return ResponseEntity.ok().build();
    }
}
