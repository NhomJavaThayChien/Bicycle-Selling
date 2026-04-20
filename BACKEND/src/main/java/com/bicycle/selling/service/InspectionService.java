package com.bicycle.selling.service;

import com.bicycle.selling.dto.*;
import com.bicycle.selling.model.*;
import com.bicycle.selling.model.enums.InspectionStatus;
import com.bicycle.selling.repository.*;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InspectionService {

    private final InspectionReportRepository inspectionReportRepository;
    private final BicycleListingRepository listingRepository;
    private final UserRepository userRepository;

    // Seller request inspection
    public InspectionResponse requestInspection(CreateInspectionRequest request, Long userId) {
        BicycleListing listing = listingRepository.findById(request.getListingId())
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (!listing.getSeller().getId().equals(userId)) {
            throw new RuntimeException("You are not the owner of this listing");
        }

        // check đã có inspection chưa
        inspectionReportRepository.findByListingId(request.getListingId())
                .ifPresent(r -> {
                    throw new RuntimeException("Inspection already exists for this listing");
                });

        InspectionReport report = InspectionReport.builder()
                .listing(listing)
                .status(InspectionStatus.REQUESTED)
                .build();

        return mapToResponse(inspectionReportRepository.save(report));
    }

    // Inspector/ admin submit report
    public InspectionResponse submitInspection(
            Long reportId,
            SubmitInspectionRequest request,
            Long inspectorId
    ) {
        InspectionReport report = getEntity(reportId);

        if (report.getStatus() != InspectionStatus.REQUESTED &&
            report.getStatus() != InspectionStatus.IN_PROGRESS) {
            throw new RuntimeException("Inspection is not in valid state");
        }

        User inspector = userRepository.findById(inspectorId)
                .orElseThrow(() -> new RuntimeException("Inspector not found"));

        // set score
        report.setFrameScore(request.getFrameScore());
        report.setBrakeScore(request.getBrakeScore());
        report.setDrivetrainScore(request.getDrivetrainScore());
        report.setWheelsScore(request.getWheelsScore());
        report.setHandlebarSaddleScore(request.getHandlebarSaddleScore());

        report.setSummary(request.getSummary());
        report.setRecommendations(request.getRecommendations());

        double avg = (
                request.getFrameScore() +
                request.getBrakeScore() +
                request.getDrivetrainScore() +
                request.getWheelsScore() +
                request.getHandlebarSaddleScore()
        ) / 5.0;

        report.setOverallScore(avg);

        if (avg >= 7) {
            report.setStatus(InspectionStatus.PASSED);
        } else {
            report.setStatus(InspectionStatus.FAILED);
        }

        report.setInspector(inspector);
        report.setInspectedAt(LocalDateTime.now());

        return mapToResponse(inspectionReportRepository.save(report));
    }

    // Cancel (seller)
    public void cancelInspection(Long reportId, Long userId) {
        InspectionReport report = getEntity(reportId);

        if (!report.getListing().getSeller().getId().equals(userId)) {
            throw new RuntimeException("Not your listing");
        }

        if (report.getStatus() == InspectionStatus.PASSED ||
            report.getStatus() == InspectionStatus.FAILED) {
            throw new RuntimeException("Cannot cancel completed inspection");
        }

        report.setStatus(InspectionStatus.CANCELLED);
        inspectionReportRepository.save(report);
    }

    // Get by id
    public InspectionResponse getById(Long id) {
        return mapToResponse(getEntity(id));
    }

    // Get by listing
    public InspectionResponse getByListing(Long listingId) {
        return mapToResponse(
                inspectionReportRepository.findByListingId(listingId)
                        .orElseThrow(() -> new RuntimeException("Inspection not found"))
        );
    }

    // List all
    public List<InspectionResponse> getAll() {
        return inspectionReportRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private InspectionReport getEntity(Long id) {
        return inspectionReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inspection report not found"));
    }

    private InspectionResponse mapToResponse(InspectionReport report) {
        return InspectionResponse.builder()
                .id(report.getId())
                .listingId(report.getListing().getId())
                .inspectorId(report.getInspector() != null ? report.getInspector().getId() : null)
                .overallScore(report.getOverallScore())
                .status(report.getStatus().name())
                .summary(report.getSummary())
                .recommendations(report.getRecommendations())
                .inspectedAt(report.getInspectedAt())
                .createdAt(report.getCreatedAt())
                .build();
    }
}