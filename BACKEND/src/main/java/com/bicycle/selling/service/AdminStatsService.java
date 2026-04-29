package com.bicycle.selling.service;

import com.bicycle.selling.dto.*;
import com.bicycle.selling.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminStatsService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final DisputeRepository disputeRepository;

    public AdminDashboardResponse getDashboard() {
        return AdminDashboardResponse.builder()
                // Đếm toàn bộ user đã đăng ký trong bảng users
                .totalUsers(userRepository.count())
                .totalOrders(orderRepository.count())
                // Tiền đã thu thực tế từ Stripe (DEPOSIT×20% + phần còn lại×100%)
                .totalRevenue(orderRepository.getTotalCollectedRevenue() != null
                        ? orderRepository.getTotalCollectedRevenue() : 0.0)
                .totalDisputes(disputeRepository.count())
                .build();
    }

    public List<OrderChartDTO> getOrdersChart() {
        return orderRepository.getOrdersPerDay()
                .stream()
                .map(o -> new OrderChartDTO(
                        ((java.sql.Date) o[0]).toLocalDate(),
                        (Long) o[1]
                ))
                .toList();
    }

    public List<RevenueChartDTO> getRevenueChart() {
        return orderRepository.getRevenuePerDay()
                .stream()
                .map(o -> new RevenueChartDTO(
                        ((java.sql.Date) o[0]).toLocalDate(),
                        ((Number) o[1]).doubleValue()
                ))
                .toList();
    }

    public List<DisputeStatsDTO> getDisputeStats() {
        return disputeRepository.countByStatus()
                .stream()
                .map(o -> new DisputeStatsDTO(
                        o[0].toString(),
                        (Long) o[1]
                ))
                .toList();
    }
}