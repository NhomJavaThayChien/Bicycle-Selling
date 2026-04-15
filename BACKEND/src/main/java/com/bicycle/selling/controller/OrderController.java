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
import org.springframework.security.access.prepost.PreAuthorize;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

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

    @GetMapping("/buyer")
    @PreAuthorize("hasAnyRole('BUYER', 'ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Danh sách đơn mua", description = "Buyer xem các đơn hàng của mình")
    public ResponseEntity<?> getOrdersByUserId(@AuthenticationPrincipal UserDetailsImpl user) {
        try {
            List<OrderResponse> orders = orderService.getOrderByUserId(user.getId());
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/seller")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Danh sách đơn bán", description = "Seller xem các đơn hàng cho các xe của mình")
    public ResponseEntity<?> getSellerOrders(@AuthenticationPrincipal UserDetailsImpl user) {
        try {
            List<OrderResponse> orders = orderService.getOrdersBySellerId(user.getId());
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{orderId}/complete")
    @PreAuthorize("hasAnyRole('BUYER', 'ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Buyer hoàn tất đơn hàng", description = "Đánh dấu đã giao dịch thành công (COMPLETED)")
    public ResponseEntity<?> completeOrder(
            @PathVariable Long orderId,
            @AuthenticationPrincipal UserDetailsImpl user) {
        try {
            orderService.completeOrder(orderId, user.getId());
            return ResponseEntity.ok(Map.of("message", "Order completed successfully. You can now leave a review!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/seller/{orderId}/reject")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Seller từ chối đơn hàng", description = "Trạng thái xe trở về APPROVED")
    public ResponseEntity<?> rejectOrder(
            @PathVariable Long orderId,
            @AuthenticationPrincipal UserDetailsImpl user) {
        try {
            orderService.rejectOrder(orderId, user.getId());
            return ResponseEntity.ok(Map.of("message", "Order rejected successfully, listing is back to APPROVED"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
