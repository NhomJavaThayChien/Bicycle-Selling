package com.bicycle.selling.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.http.ResponseEntity;
import com.bicycle.selling.security.UserDetailsImpl;
import org.springframework.web.bind.annotation.*;

import com.bicycle.selling.dto.CreateOrderRequest;
import com.bicycle.selling.dto.OrderResponse;
import com.bicycle.selling.model.Order;
import com.bicycle.selling.model.enums.OrderStatus;
import com.bicycle.selling.service.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    final OrderService orderService;

    @PostMapping
    public ResponseEntity<?> createOrder(
            @RequestBody CreateOrderRequest request,
            @AuthenticationPrincipal UserDetailsImpl user) {
        try {
            Order order = orderService.createOrder(request, user.getId());
            OrderResponse response = new OrderResponse(
                    order.getId(),
                    order.getBuyer().getId(),
                    order.getListing().getId(),
                    order.getAgreedPrice(),
                    order.getStatus().name());
    
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderDetails(
            @PathVariable Long orderId,
            @AuthenticationPrincipal UserDetailsImpl user) {
        try {
            Order order = orderService.getOrderById(orderId);
            OrderResponse response = new OrderResponse(
                    order.getId(),
                    order.getBuyer().getId(),
                    order.getListing().getId(),
                    order.getAgreedPrice(),
                    order.getStatus().name());
    
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(
            @PathVariable Long orderId) {
        try {
            orderService.setOrderStatus(orderId, OrderStatus.CANCELLED);
            return ResponseEntity.ok("Order cancelled successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{orderId}/confirm")
    public ResponseEntity<?> confirmOrder(
            @PathVariable Long orderId) {
        try {
            orderService.setConfirmOrder(orderId);
            return ResponseEntity.ok("Order confirmed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
