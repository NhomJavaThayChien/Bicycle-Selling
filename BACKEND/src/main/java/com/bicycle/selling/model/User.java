package com.bicycle.selling.model;

import com.bicycle.selling.model.enums.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity đại diện cho người dùng trong hệ thống.
 * Hỗ trợ đa vai trò: GUEST, BUYER, SELLER, INSPECTOR, ADMIN
 */
@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_user_email", columnList = "email"),
        @Index(name = "idx_user_username", columnList = "username")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 3, max = 50)
    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @NotBlank
    @Email
    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String password;

    @Column(length = 20)
    private String phone;

    @Column(name = "full_name", length = 100)
    private String fullName;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private UserRole role = UserRole.BUYER;

    @Column(name = "is_active")
    @Builder.Default
    private boolean isActive = true;

    // Điểm uy tín (tính trung bình từ các review)
    @Column(name = "reputation_score", columnDefinition = "DECIMAL(3,2) DEFAULT 0.0")
    @Builder.Default
    private Double reputationScore = 0.0;

    @Column(name = "total_sales")
    @Builder.Default
    private Integer totalSales = 0;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Relationships
    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<BicycleListing> listings = new ArrayList<>();

    @OneToMany(mappedBy = "buyer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Order> orders = new ArrayList<>();

    @OneToMany(mappedBy = "reviewer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Review> reviewsGiven = new ArrayList<>();

    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Review> reviewsReceived = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Wishlist> wishlist = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Notification> notifications = new ArrayList<>();
}
