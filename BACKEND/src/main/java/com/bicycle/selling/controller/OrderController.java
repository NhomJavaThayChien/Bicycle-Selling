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
    public OrderResponse createOrder(
            @RequestBody CreateOrderRequest request,
            @AuthenticationPrincipal UserDetailsImpl user) {
        Order order = orderService.createOrder(request, user.getId());
        OrderResponse response = new OrderResponse(
                order.getId(),
                order.getBuyer().getId(),
                order.getListing().getId(),
                order.getAgreedPrice(),
                order.getStatus().name());

        return response;
    }

    @GetMapping("/{orderId}")
    public OrderResponse getOrderDetails(
            @PathVariable Long orderId,
            @AuthenticationPrincipal UserDetailsImpl user) {
        Order order = orderService.getOrderById(orderId);
        OrderResponse response = new OrderResponse(
                order.getId(),
                order.getBuyer().getId(),
                order.getListing().getId(),
                order.getAgreedPrice(),
                order.getStatus().name());

        return response;
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<Map<String, String>> cancelOrder(@PathVariable Long orderId) {
        orderService.cancelOrder(orderId);
        return ResponseEntity.ok(Map.of("message", "Order cancelled successfully"));
    }

    @PutMapping("/{orderId}/confirm")
    public ResponseEntity<Map<String, String>> confirmOrder(
            @PathVariable Long orderId) {
        orderService.setConfirmOrder(orderId);
        return ResponseEntity.ok(Map.of("message", "Order confirmed successfully"));
    }

    @GetMapping
    public List<OrderResponse> getOrdersByUserId(@AuthenticationPrincipal UserDetailsImpl user) {
        return orderService.getOrderByUserId(user.getId());
    }
}
