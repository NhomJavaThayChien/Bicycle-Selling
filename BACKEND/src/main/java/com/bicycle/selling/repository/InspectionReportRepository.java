package com.bicycle.selling.repository;

import com.bicycle.selling.model.InspectionReport;
import com.bicycle.selling.model.enums.InspectionStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface InspectionReportRepository extends JpaRepository<InspectionReport, Long> {

    // Lấy report theo listing (1-1)
    Optional<InspectionReport> findByListingId(Long listingId);

    // Lấy danh sách theo inspector
    List<InspectionReport> findByInspectorId(Long inspectorId);

    // Lọc theo status
    List<InspectionReport> findByStatus(InspectionStatus status);
}