package com.bicycle.selling.model;

import com.bicycle.selling.model.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Đơn đặt mua / đặt cọc từ Buyer cho một tin đăng.
 */
@Entity
@Table(name = "orders", indexes = {
        @Index(name = "idx_order_buyer", columnList = "buyer_id"),
        @Index(name = "idx_order_listing", columnList = "listing_id"),
        @Index(name = "idx_order_status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Mã đơn hàng dễ đọc (VD: ORD-20240301-001)
    @Column(name = "order_code", unique = true, length = 30)
    private String orderCode;

    // Giá đã thoả thuận tại thời điểm đặt
    @Column(name = "agreed_price", columnDefinition = "DECIMAL(12,0)", nullable = false)
    private BigDecimal agreedPrice;

    // Số tiền đặt cọc ( thường 10-30% giá trị xe)
    @Column(name = "deposit_amount", columnDefinition = "DECIMAL(12,0)")
    @Builder.Default
    private BigDecimal depositAmount = BigDecimal.ZERO;

    // Ghi chú của buyer
    @Column(columnDefinition = "TEXT")
    private String note;

    // Địa chỉ nhận hàng
    @Column(name = "shipping_address", columnDefinition = "TEXT")
    private String shippingAddress;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User buyer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private BicycleListing listing;

    // Thanh toán đặt cọc
    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Payment payment;

    // Vận chuyển GHN
    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private ShippingOrder shippingOrder;

    // Tranh chấp (nếu có)
    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Dispute dispute;
}
