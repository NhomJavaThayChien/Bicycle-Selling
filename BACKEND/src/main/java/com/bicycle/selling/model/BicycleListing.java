package com.bicycle.selling.model;

import com.bicycle.selling.model.enums.BikeCondition;
import com.bicycle.selling.model.enums.ListingStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Tin đăng bán xe đạp - Entity trung tâm của hệ thống.
 * Chứa thông tin kỹ thuật đầy đủ của xe đạp thể thao.
 */
@Entity
@Table(name = "bicycle_listings", indexes = {
        @Index(name = "idx_listing_seller", columnList = "seller_id"),
        @Index(name = "idx_listing_status", columnList = "status"),
        @Index(name = "idx_listing_price", columnList = "price"),
        @Index(name = "idx_listing_brand", columnList = "brand_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BicycleListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    // ============ Thông tin kỹ thuật xe ============
    // Năm sản xuất
    @Column(name = "manufacture_year")
    private Integer manufactureYear;

    // Kích thước khung (XS/S/M/L/XL hoặc số cm)
    @Column(name = "frame_size", length = 20)
    private String frameSize;

    // Chất liệu khung (Aluminum, Carbon, Steel, Titanium)
    @Column(name = "frame_material", length = 50)
    private String frameMaterial;

    // Số speed/số líp
    @Column(name = "speed_count")
    private Integer speedCount;

    // Bộ truyền động (Shimano Claris, Tiagra, 105, Ultegra, Dura-Ace...)
    @Column(name = "drivetrain", length = 100)
    private String drivetrain;

    // Hệ thống phanh (Rim brake, Disc Hydraulic, Disc Mechanical)
    @Column(name = "brake_type", length = 50)
    private String brakeType;

    // Kích thước bánh (700c, 26", 27.5", 29")
    @Column(name = "wheel_size", length = 20)
    private String wheelSize;

    // Trọng lượng xe (kg)
    @Column(name = "weight_kg", columnDefinition = "DECIMAL(5,2)")
    private BigDecimal weightKg;

    // Màu sắc
    @Column(length = 50)
    private String color;

    // Tình trạng xe
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private BikeCondition condition = BikeCondition.GOOD;

    // Mô tả lịch sử sử dụng
    @Column(name = "usage_history", columnDefinition = "TEXT")
    private String usageHistory;

    // Phụ kiện đi kèm
    @Column(name = "accessories", columnDefinition = "TEXT")
    private String accessories;

    // Lý do bán
    @Column(name = "reason_for_selling", columnDefinition = "TEXT")
    private String reasonForSelling;

    // ============ Thông tin giá & vị trí ============
    @NotNull
    @DecimalMin("0.0")
    @Column(nullable = false, columnDefinition = "DECIMAL(12,0)")
    private BigDecimal price;

    // Có thể thương lượng không
    @Column(name = "is_negotiable")
    @Builder.Default
    private boolean isNegotiable = false;

    // Địa chỉ / khu vực bán (tỉnh/thành phố)
    @Column(length = 100)
    private String location;

    // ============ Trạng thái & kiểm định ============
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private ListingStatus status = ListingStatus.PENDING_APPROVAL;

    // Đã được kiểm định chưa
    @Column(name = "is_inspected")
    @Builder.Default
    private boolean isInspected = false;

    // Số lượt xem
    @Column(name = "view_count")
    @Builder.Default
    private Integer viewCount = 0;

    // Lý do bị từ chối (nếu có)
    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    // URL video giới thiệu xe
    @Column(name = "video_url")
    private String videoUrl;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "expired_at")
    private LocalDateTime expiredAt;

    // ============ Relationships ============
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User seller;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Brand brand;

    // Hình ảnh tin đăng
    @OneToMany(mappedBy = "listing", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<ListingImage> images = new ArrayList<>();

    // Báo cáo kiểm định (nếu đã yêu cầu)
    @OneToOne(mappedBy = "listing", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private InspectionReport inspectionReport;

    // Đơn mua
    @OneToMany(mappedBy = "listing", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Order> orders = new ArrayList<>();

    // Wishlist
    @OneToMany(mappedBy = "listing", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Wishlist> wishlists = new ArrayList<>();
}
