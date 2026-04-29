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

    @org.springframework.transaction.annotation.Transactional
    public InspectionResponse submitInspection(
            Long reportId,
            SubmitInspectionRequest request,
            Long inspectorId) {
        try {
            System.out.println(">>> [TRANSACTION START] Submitting inspection for reportId: " + reportId);
            InspectionReport report = inspectionReportRepository.findById(reportId)
                    .orElseThrow(() -> new RuntimeException("Inspection report not found with ID: " + reportId));

            User inspector = userRepository.findById(inspectorId)
                    .orElseThrow(() -> new RuntimeException("Inspector not found with ID: " + inspectorId));

            // Tính trung bình chỉ từ các điểm được điền (optional fields)
            int totalScore = 0;
            int count = 0;

            if (request.getFrameScore() != null) {
                report.setFrameScore(request.getFrameScore());
                totalScore += request.getFrameScore();
                count++;
            }
            if (request.getBrakeScore() != null) {
                report.setBrakeScore(request.getBrakeScore());
                totalScore += request.getBrakeScore();
                count++;
            }
            if (request.getDrivetrainScore() != null) {
                report.setDrivetrainScore(request.getDrivetrainScore());
                totalScore += request.getDrivetrainScore();
                count++;
            }
            if (request.getWheelsScore() != null) {
                report.setWheelsScore(request.getWheelsScore());
                totalScore += request.getWheelsScore();
                count++;
            }
            if (request.getHandlebarSaddleScore() != null) {
                report.setHandlebarSaddleScore(request.getHandlebarSaddleScore());
                totalScore += request.getHandlebarSaddleScore();
                count++;
            }

            if (count == 0) {
                throw new RuntimeException("Phải nhập ít nhất một hạng mục điểm");
            }

            report.setSummary(request.getSummary());
            report.setRecommendations(request.getRecommendations());

            double avg = (double) totalScore / count;
            report.setOverallScore(avg);

            BicycleListing listing = report.getListing();
            if (avg >= 7) {
                report.setStatus(InspectionStatus.PASSED);
                if (listing != null) {
                    listing.setInspected(true);
                    listing.setStatus(com.bicycle.selling.model.enums.ListingStatus.APPROVED);
                    listing.setRejectionReason(null);
                    listingRepository.save(listing);
                }
            } else {
                // Nếu như điểm trung bình dưới 7, coi như failed và reject listing
                report.setStatus(InspectionStatus.FAILED);
                if (listing != null) {
                    listing.setInspected(false);
                    listing.setStatus(com.bicycle.selling.model.enums.ListingStatus.REJECTED);
                    listing.setRejectionReason(String.format("Không đạt kiểm định (Điểm trung bình: %.2f)", avg));
                    listingRepository.save(listing);
                }
            }

            report.setInspector(inspector);
            report.setInspectedAt(LocalDateTime.now());

            InspectionReport savedReport = inspectionReportRepository.save(report);
            System.out.println(">>> [TRANSACTION SUCCESS] Saved report #" + reportId);
            return mapToResponse(savedReport);
        } catch (Exception e) {
            System.err.println(">>> [TRANSACTION FAIL] reportId " + reportId + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Lỗi hệ thống: " + e.getMessage());
        }
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
                        .orElseThrow(() -> new RuntimeException("Inspection not found")));
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
        if (report == null)
            return null;

        Long listingId = null;
        if (report.getListing() != null) {
            listingId = report.getListing().getId();
        }

        return InspectionResponse.builder()
                .id(report.getId())
                .listingId(listingId)
                .inspectorId(report.getInspector() != null ? report.getInspector().getId() : null)
                .overallScore(report.getOverallScore())
                .status(report.getStatus() != null ? report.getStatus().name() : "REQUESTED")
                .summary(report.getSummary())
                .recommendations(report.getRecommendations())
                .inspectedAt(report.getInspectedAt())
                .createdAt(report.getCreatedAt())
                .build();
    }
}