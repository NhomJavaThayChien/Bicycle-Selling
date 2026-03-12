package com.bicycle.selling.model;

import com.bicycle.selling.model.enums.ShippingStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Đơn vận chuyển tích hợp GHN (Giao Hàng Nhanh) - sandbox.
 * Lưu trữ thông tin giao nhận và tracking.
 */
@Entity
@Table(name = "shipping_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Mã vận đơn GHN (sandbox)
    @Column(name = "ghn_order_code", unique = true, length = 50)
    private String ghnOrderCode;

    // Phí vận chuyển
    @Column(name = "shipping_fee", columnDefinition = "DECIMAL(10,0)")
    @Builder.Default
    private BigDecimal shippingFee = BigDecimal.ZERO;

    // Tên người nhận
    @Column(name = "recipient_name", length = 100)
    private String recipientName;

    // SĐT người nhận
    @Column(name = "recipient_phone", length = 20)
    private String recipientPhone;

    // Địa chỉ giao hàng chi tiết
    @Column(name = "recipient_address", columnDefinition = "TEXT")
    private String recipientAddress;

    // Tỉnh/Thành phố người nhận
    @Column(name = "recipient_province_id")
    private Integer recipientProvinceId;

    @Column(name = "recipient_province_name", length = 100)
    private String recipientProvinceName;

    // Quận/Huyện
    @Column(name = "recipient_district_id")
    private Integer recipientDistrictId;

    @Column(name = "recipient_district_name", length = 100)
    private String recipientDistrictName;

    // Phường/Xã
    @Column(name = "recipient_ward_code", length = 20)
    private String recipientWardCode;

    @Column(name = "recipient_ward_name", length = 100)
    private String recipientWardName;

    // Cân nặng ước tính (gram)
    @Column(name = "weight_gram")
    @Builder.Default
    private Integer weightGram = 10000;

    // Kích thước hàng (cm)
    @Column(name = "length_cm")
    private Integer lengthCm;

    @Column(name = "width_cm")
    private Integer widthCm;

    @Column(name = "height_cm")
    private Integer heightCm;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private ShippingStatus status = ShippingStatus.WAITING_PICKUP;

    // URL tracking đơn hàng
    @Column(name = "tracking_url")
    private String trackingUrl;

    // Ghi chú
    @Column(columnDefinition = "TEXT")
    private String note;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Order order;
}
