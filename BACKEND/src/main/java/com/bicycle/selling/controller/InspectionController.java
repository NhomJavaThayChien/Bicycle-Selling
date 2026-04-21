package com.bicycle.selling.controller;

import com.bicycle.selling.dto.*;
import com.bicycle.selling.security.UserDetailsImpl;
import com.bicycle.selling.service.InspectionService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/inspections")
public class InspectionController {

    private final InspectionService inspectionService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    public ResponseEntity<InspectionResponse> requestInspection(
            @Valid @RequestBody CreateInspectionRequest request,
            @AuthenticationPrincipal UserDetailsImpl user
    ) {
        return ResponseEntity.ok(
                inspectionService.requestInspection(request, user.getId())
        );
    }

    @PutMapping("/{reportId}/submit")
    @PreAuthorize("hasAnyRole('INSPECTOR', 'ADMIN')")
    public ResponseEntity<InspectionResponse> submitInspection(
            @PathVariable Long reportId,
            @Valid @RequestBody SubmitInspectionRequest request,
            @AuthenticationPrincipal UserDetailsImpl user
    ) {
        return ResponseEntity.ok(
                inspectionService.submitInspection(reportId, request, user.getId())
        );
    }

    @PutMapping("/{reportId}/cancel")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    public ResponseEntity<Void> cancelInspection(
            @PathVariable Long reportId,
            @AuthenticationPrincipal UserDetailsImpl user
    ) {
        inspectionService.cancelInspection(reportId, user.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{reportId}")
    public ResponseEntity<InspectionResponse> getInspectionById(
            @PathVariable Long reportId
    ) {
        return ResponseEntity.ok(
                inspectionService.getById(reportId)
        );
    }

    @GetMapping("/listing/{listingId}")
    public ResponseEntity<InspectionResponse> getByListing(
            @PathVariable Long listingId
    ) {
        return ResponseEntity.ok(
                inspectionService.getByListing(listingId)
        );
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INSPECTOR')")
    public ResponseEntity<List<InspectionResponse>> getAllInspections() {
        return ResponseEntity.ok(
                inspectionService.getAll()
        );
    }
}