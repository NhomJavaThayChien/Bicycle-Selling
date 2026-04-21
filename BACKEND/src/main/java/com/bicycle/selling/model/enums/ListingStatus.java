package com.bicycle.selling.model.enums;

public enum ListingStatus {
    PENDING_APPROVAL,   // Chờ admin duyệt
    APPROVED,           // Đã duyệt - đang hiển thị
    REJECTED,           // Bị từ chối
    HIDDEN,             // Người bán ẩn
    RESERVED,           // Đã được giữ (lúc tạo order)
    SOLD,               // Đã bán (đã hoàn tất giao dịch)
    EXPIRED             // Hết hạn
}
