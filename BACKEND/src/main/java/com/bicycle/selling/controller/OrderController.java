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

import java.util.List;
import java.util.Map;

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
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
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
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(
            @PathVariable Long orderId) {
        try {
            orderService.setOrderStatus(orderId, OrderStatus.CANCELLED);
            return ResponseEntity.ok(Map.of("message", "Order cancelled successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{orderId}/confirm")
    public ResponseEntity<?> confirmOrder(
            @PathVariable Long orderId) {
        try {
            orderService.setConfirmOrder(orderId);
            return ResponseEntity.ok(Map.of("message", "Order confirmed successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getOrdersByUserId(@AuthenticationPrincipal UserDetailsImpl user) {
        try {
            List<OrderResponse> orders = orderService.getOrderByUserId(user.getId());
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
