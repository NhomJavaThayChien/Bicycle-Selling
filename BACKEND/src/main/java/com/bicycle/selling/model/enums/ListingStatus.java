package com.bicycle.selling.model.enums;

public enum ListingStatus {
    PENDING_APPROVAL,   // Chờ admin duyệt
    APPROVED,           // Đã duyệt - đang hiển thị
    REJECTED,           // Bị từ chối
    HIDDEN,             // Người bán ẩn
    SOLD,               // Đã bán
    EXPIRED             // Hết hạn
}
