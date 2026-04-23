package com.bicycle.selling.controller;

import com.bicycle.selling.dto.*;
import com.bicycle.selling.service.AdminStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/stats")
@PreAuthorize("hasRole('ADMIN')")
public class AdminStatsController {

    private final AdminStatsService statsService;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboard() {
        return ResponseEntity.ok(statsService.getDashboard());
    }

    @GetMapping("/orders-chart")
    public ResponseEntity<List<OrderChartDTO>> getOrdersChart() {
        return ResponseEntity.ok(statsService.getOrdersChart());
    }

    @GetMapping("/revenue-chart")
    public ResponseEntity<List<RevenueChartDTO>> getRevenueChart() {
        return ResponseEntity.ok(statsService.getRevenueChart());
    }
    
    @GetMapping("/disputes")
    public ResponseEntity<List<DisputeStatsDTO>> getDisputeStats() {
        return ResponseEntity.ok(statsService.getDisputeStats());
    }
}