package com.bicycle.selling.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Danh sách xe yêu thích của Buyer (Wishlist).
 */
@Entity
@Table(name = "wishlists",
        uniqueConstraints = {
                @UniqueConstraint(name = "uc_wishlist_user_listing",
                        columnNames = {"user_id", "listing_id"})
        })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp
    @Column(name = "saved_at", updatable = false)
    private LocalDateTime savedAt;

    // Ghi chú cá nhân của user (VD: "Hỏi thêm khi có tiền")
    @Column(length = 255)
    private String note;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private BicycleListing listing;
}
