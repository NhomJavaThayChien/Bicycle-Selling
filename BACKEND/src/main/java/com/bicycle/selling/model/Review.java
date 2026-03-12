package com.bicycle.selling.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Đánh giá uy tín của Seller sau khi giao dịch hoàn tất.
 * Reviewer là Buyer, Seller là người bán.
 */
@Entity
@Table(name = "reviews", indexes = {
        @Index(name = "idx_review_seller", columnList = "seller_id"),
        @Index(name = "idx_review_order", columnList = "order_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Điểm đánh giá (1-5 sao)
    @Min(1) @Max(5)
    @Column(nullable = false)
    private Integer rating;

    // Nội dung đánh giá
    @Column(columnDefinition = "TEXT")
    private String comment;

    // Đánh giá về: Tình trạng xe có đúng mô tả không?
    @Min(1) @Max(5)
    @Column(name = "accuracy_rating")
    private Integer accuracyRating;

    // Đánh giá về: Thái độ người bán
    @Min(1) @Max(5)
    @Column(name = "communication_rating")
    private Integer communicationRating;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Người viết đánh giá (Buyer)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User reviewer;

    // Người bán được đánh giá (Seller)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User seller;

    // Đơn hàng gắn với đánh giá này
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Order order;
}
