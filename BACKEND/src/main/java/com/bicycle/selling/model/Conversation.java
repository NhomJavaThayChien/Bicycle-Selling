package com.bicycle.selling.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Cuộc hội thoại (thread) giữa Buyer và Seller về một tin đăng cụ thể.
 */
@Entity
@Table(name = "conversations", indexes = {
        @Index(name = "idx_conv_buyer_seller", columnList = "buyer_id, seller_id"),
        @Index(name = "idx_conv_listing", columnList = "listing_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User buyer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User seller;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private BicycleListing listing;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Message> messages = new ArrayList<>();
}
