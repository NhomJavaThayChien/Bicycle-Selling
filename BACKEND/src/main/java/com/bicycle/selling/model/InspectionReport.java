package com.bicycle.selling.model;

import com.bicycle.selling.model.enums.InspectionStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Báo cáo kiểm định từ Inspector cho một tin đăng.
 * Inspector kiểm tra và cấp nhãn "Xe đã kiểm định".
 */
@Entity
@Table(name = "inspection_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InspectionReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ============ Kết quả kiểm định từng hạng mục ============
    // Tình trạng khung xe (điểm 1-10)
    @Min(1) @Max(10)
    @Column(name = "frame_score")
    private Integer frameScore;

    @Column(name = "frame_note", columnDefinition = "TEXT")
    private String frameNote;

    // Tình trạng phanh (điểm 1-10)
    @Min(1) @Max(10)
    @Column(name = "brake_score")
    private Integer brakeScore;

    @Column(name = "brake_note", columnDefinition = "TEXT")
    private String brakeNote;

    // Tình trạng truyền động / líp / xích (điểm 1-10)
    @Min(1) @Max(10)
    @Column(name = "drivetrain_score")
    private Integer drivetrainScore;

    @Column(name = "drivetrain_note", columnDefinition = "TEXT")
    private String drivetrainNote;

    // Tình trạng bánh xe (điểm 1-10)
    @Min(1) @Max(10)
    @Column(name = "wheels_score")
    private Integer wheelsScore;

    @Column(name = "wheels_note", columnDefinition = "TEXT")
    private String wheelsNote;

    // Tình trạng tay lái / yên xe (điểm 1-10)
    @Min(1) @Max(10)
    @Column(name = "handlebar_saddle_score")
    private Integer handlebarSaddleScore;

    @Column(name = "handlebar_saddle_note", columnDefinition = "TEXT")
    private String handlebarSaddleNote;

    // Điểm tổng (tính trung bình của các hạng mục)
    @Column(name = "overall_score", columnDefinition = "DECIMAL(4,2)")
    private Double overallScore;

    // Kết luận tổng quát
    @Column(name = "summary", columnDefinition = "TEXT")
    private String summary;

    // Khuyến nghị sửa chữa
    @Column(name = "recommendations", columnDefinition = "TEXT")
    private String recommendations;

    // URL file báo cáo PDF
    @Column(name = "report_pdf_url")
    private String reportPdfUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private InspectionStatus status = InspectionStatus.REQUESTED;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "inspected_at")
    private LocalDateTime inspectedAt;

    // Người kiểm định (User với role INSPECTOR)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inspector_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User inspector;

    // Tin đăng được kiểm định
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private BicycleListing listing;
}
