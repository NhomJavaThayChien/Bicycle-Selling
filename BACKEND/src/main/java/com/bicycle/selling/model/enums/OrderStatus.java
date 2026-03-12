package com.bicycle.selling.model.enums;

public enum OrderStatus {
    PENDING,            // Đang chờ xác nhận
    DEPOSIT_PAID,       // Đã đặt cọc
    CONFIRMED,          // Người bán đã xác nhận
    SHIPPING,           // Đang giao hàng
    COMPLETED,          // Hoàn thành
    CANCELLED,          // Đã huỷ
    DISPUTED            // Đang tranh chấp
}
