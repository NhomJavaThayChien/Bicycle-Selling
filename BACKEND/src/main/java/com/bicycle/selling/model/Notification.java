package com.bicycle.selling.model;

import com.bicycle.selling.model.enums.NotificationType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Thông báo gửi đến người dùng trong hệ thống.
 * VD: đơn hàng mới, tin nhắn mới, kết quả kiểm định...
 */
@Entity
@Table(name = "notifications", indexes = {
        @Index(name = "idx_notif_user_read", columnList = "user_id, is_read")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private NotificationType type;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    // Link điều hướng khi click vào thông báo
    @Column(name = "action_url")
    private String actionUrl;

    @Column(name = "is_read")
    @Builder.Default
    private boolean isRead = false;

    // ID của entity liên quan (order_id / listing_id / dispute_id...)
    @Column(name = "reference_id")
    private Long referenceId;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User user;
}
