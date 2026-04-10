package com.bicycle.selling.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.http.ResponseEntity;
import com.bicycle.selling.security.UserDetailsImpl;
import org.springframework.web.bind.annotation.*;

import com.bicycle.selling.dto.CreateOrderRequest;
import com.bicycle.selling.dto.OrderResponse;
import com.bicycle.selling.model.Order;
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

            // Bug fix #2: Ownership check — chỉ buyer của đơn hoặc seller của listing mới xem được
            Long buyerId = order.getBuyer().getId();
            Long sellerId = order.getListing().getSeller().getId();
            boolean isAdmin = user.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

            if (!isAdmin && !user.getId().equals(buyerId) && !user.getId().equals(sellerId)) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied: you are not involved in this order"));
            }

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
            @PathVariable Long orderId,
            @AuthenticationPrincipal UserDetailsImpl user) {
        try {
            // Bug fix #2 + #3: dùng cancelOrder() với ownership check + listing rollback
            orderService.cancelOrder(orderId, user.getId());
            return ResponseEntity.ok(Map.of("message", "Order cancelled successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{orderId}/confirm")
    public ResponseEntity<?> confirmOrder(
            @PathVariable Long orderId,
            @AuthenticationPrincipal UserDetailsImpl user) {
        try {
            // Bug fix #6: chỉ seller của listing mới confirm được
            orderService.setConfirmOrder(orderId, user.getId());
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
