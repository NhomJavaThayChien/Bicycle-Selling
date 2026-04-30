package com.bicycle.selling.controller;

import com.bicycle.selling.dto.*;
import com.bicycle.selling.security.UserDetailsImpl;
import com.bicycle.selling.service.DisputeService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/disputes")
public class DisputeController {

    private final DisputeService disputeService;

    @PostMapping
    @PreAuthorize("hasAnyRole('BUYER', 'ADMIN')")
    public ResponseEntity<DisputeResponse> createDispute(
            @Valid @RequestBody CreateDisputeRequest request,
            @AuthenticationPrincipal UserDetailsImpl user
    ) {
        return ResponseEntity.ok(
                disputeService.createDispute(request, user.getId())
        );
    }

    @PutMapping("/{id}/take")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DisputeResponse> takeDispute(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl user
    ) {
        return ResponseEntity.ok(
                disputeService.takeDispute(id, user.getId())
        );
    }

    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DisputeResponse> resolveDispute(
            @PathVariable Long id,
            @Valid @RequestBody ResolveDisputeRequest request,
            @AuthenticationPrincipal UserDetailsImpl user
    ) {
        return ResponseEntity.ok(
                disputeService.resolveDispute(id, request, user.getId())
        );
    }

    @PutMapping("/{id}/close")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DisputeResponse> closeDispute(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                disputeService.closeDispute(id)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisputeResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(
                disputeService.getById(id)
        );
    }

    /**
     * Lấy tranh chấp theo Order ID. 
     * Dùng cho cả Buyer và Seller để xem tiến trình/phán quyết.
     */
    @GetMapping("/order/{orderId}")
    public ResponseEntity<DisputeResponse> getByOrderId(@PathVariable Long orderId) {
        return ResponseEntity.ok(
                disputeService.getByOrderId(orderId)
        );
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DisputeResponse>> getAll() {
        return ResponseEntity.ok(
                disputeService.getAll()
        );
    }

    /**
     * Lấy danh sách ID các đơn hàng mà người dùng hiện tại đã mở tranh chấp.
     */
    @GetMapping("/mine")
    @PreAuthorize("hasAnyRole('BUYER', 'ADMIN')")
    public ResponseEntity<List<Long>> getMyDisputedOrderIds(@AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(
                disputeService.getDisputedOrderIdsByBuyer(user.getId())
        );
    }
}