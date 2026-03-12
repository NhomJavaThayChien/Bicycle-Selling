package com.bicycle.selling.model.enums;

public enum ShippingStatus {
    WAITING_PICKUP,     // Chờ lấy hàng
    PICKED_UP,          // Đã lấy hàng
    IN_TRANSIT,         // Đang vận chuyển
    DELIVERED,          // Đã giao
    FAILED_DELIVERY,    // Giao thất bại
    RETURNED            // Đã hoàn hàng
}
