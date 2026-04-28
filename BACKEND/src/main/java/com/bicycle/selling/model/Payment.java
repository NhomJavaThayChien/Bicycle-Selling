package com.bicycle.selling.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.bicycle.selling.model.enums.PaymentMethod;
import com.bicycle.selling.model.enums.PaymentStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * Thanh toán cho đơn hàng (Stripe sandbox / giả lập).
 * Hỗ trợ: đặt cọc hoặc thanh toán toàn bộ.
 */
@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Stripe Payment Intent ID (sandbox)
    @Column(name = "stripe_payment_intent_id", unique = true)
    private String stripePaymentIntentId;

    // Stripe Charge ID sau khi confirm
    @Column(name = "stripe_charge_id")
    private String stripeChargeId;

    @Column(nullable = false, columnDefinition = "DECIMAL(12,0)")
    private BigDecimal amount;

    // Đơn vị tiền tệ (VND / USD)
    @Column(length = 10)
    @Builder.Default
    private String currency = "VND";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private PaymentMethod method = PaymentMethod.STRIPE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private PaymentStatus status = PaymentStatus.PENDING;

    // Đây là thanh toán đặt cọc hay toàn bộ
    @Column(name = "is_deposit")
    @Builder.Default
    private boolean isDeposit = true;

    // Metadata của Stripe (JSON string để debug)
    @Column(name = "stripe_metadata", columnDefinition = "TEXT")
    private String stripeMetadata;

    // Lý do thất bại (nếu có)
    @Column(name = "failure_reason")
    private String failureReason;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;


    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Order order;
}
