package com.bicycle.selling.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminDashboardResponse {

    private long totalUsers;
    private long totalOrders;
    private double totalRevenue;
    private long totalDisputes;
}