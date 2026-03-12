package com.bicycle.selling.model;

import com.bicycle.selling.model.enums.DisputeStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Tranh chấp giữa Buyer và Seller.
 * Admin hoặc Inspector sẽ xử lý tranh chấp.
 */
@Entity
@Table(name = "disputes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Dispute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Lý do tranh chấp
    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason;

    // Mô tả chi tiết từ người mở tranh chấp
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    // Bằng chứng (URL ảnh/video)
    @Column(name = "evidence_urls", columnDefinition = "TEXT")
    private String evidenceUrls;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private DisputeStatus status = DisputeStatus.OPEN;

    // Kết quả giải quyết từ Admin
    @Column(name = "resolution", columnDefinition = "TEXT")
    private String resolution;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    // Người mở tranh chấp (thường là Buyer)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "opened_by_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User openedBy;

    // Admin xử lý tranh chấp
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "handled_by_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User handledBy;

    // Đơn hàng liên quan
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Order order;
}
