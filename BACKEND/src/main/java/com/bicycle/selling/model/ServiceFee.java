package com.bicycle.selling.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Phí dịch vụ của nền tảng trên mỗi giao dịch hoàn thành.
 * Admin quản lý và theo dõi doanh thu.
 */
@Entity
@Table(name = "service_fees")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceFee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // % phí dịch vụ (VD: 3.5 = 3.5%)
    @Column(name = "fee_percentage", columnDefinition = "DECIMAL(5,2)", nullable = false)
    private BigDecimal feePercentage;

    // Số tiền phí thực tế
    @Column(name = "fee_amount", columnDefinition = "DECIMAL(12,0)", nullable = false)
    private BigDecimal feeAmount;

    // Tổng giá trị giao dịch
    @Column(name = "transaction_amount", columnDefinition = "DECIMAL(12,0)", nullable = false)
    private BigDecimal transactionAmount;

    // Đã thu phí chưa
    @Column(name = "is_collected")
    @Builder.Default
    private boolean isCollected = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "collected_at")
    private LocalDateTime collectedAt;

    // Gắn với đơn hàng cụ thể
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Order order;
}
