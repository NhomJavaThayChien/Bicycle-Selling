package com.bicycle.selling.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Hình ảnh đính kèm cho mỗi tin đăng.
 * Một tin đăng có thể có nhiều ảnh.
 */
@Entity
@Table(name = "listing_images")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ListingImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    // Thứ tự hiển thị (ảnh đầu tiên là ảnh bìa)
    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;

    @Column(name = "is_primary")
    @Builder.Default
    private boolean isPrimary = false;

    @CreationTimestamp
    @Column(name = "uploaded_at", updatable = false)
    private LocalDateTime uploadedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private BicycleListing listing;
}
