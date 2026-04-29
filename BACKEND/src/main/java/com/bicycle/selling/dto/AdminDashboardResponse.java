package com.bicycle.selling.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminDashboardResponse {

    private long totalUsers;        // Tất cả user đã đăng ký trong bảng users
    private long totalOrders;       // Tất cả đơn hàng
    private double totalRevenue;    // Tiền đã thu thực tế (DEPOSIT_PAID×20% + còn lại×100%)
    private long totalDisputes;
}