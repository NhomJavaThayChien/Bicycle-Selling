package com.bicycle.selling.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Thương hiệu xe đạp (VD: Giant, Trek, Specialized, Cannondale, Scott...)
 */
@Entity
@Table(name = "brands")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Brand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true, nullable = false, length = 100)
    private String name;

    // Quốc gia xuất xứ
    @Column(length = 100)
    private String country;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "website_url")
    private String websiteUrl;

    @Column(name = "is_active")
    @Builder.Default
    private boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "brand", fetch = FetchType.LAZY)
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<BicycleListing> listings = new ArrayList<>();
}
