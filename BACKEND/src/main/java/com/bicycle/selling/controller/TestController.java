package com.bicycle.selling.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
@Tag(name = "Test", description = "API test phân quyền")
@SecurityRequirement(name = "Bearer Authentication")
public class TestController {
    
    @GetMapping("/public")
    @Operation(summary = "Endpoint công khai")
    public String publicEndpoint() {
        return "Public content - không cần đăng nhập";
    }
    
    @GetMapping("/buyer")
    @PreAuthorize("hasRole('BUYER')")
    @Operation(summary = "Endpoint cho BUYER")
    public String buyerEndpoint() {
        return "Buyer content - chỉ BUYER mới truy cập được";
    }
    
    @GetMapping("/seller")
    @PreAuthorize("hasRole('SELLER')")
    @Operation(summary = "Endpoint cho SELLER")
    public String sellerEndpoint() {
        return "Seller content - chỉ SELLER mới truy cập được";
    }
    
    @GetMapping("/inspector")
    @PreAuthorize("hasRole('INSPECTOR')")
    @Operation(summary = "Endpoint cho INSPECTOR")
    public String inspectorEndpoint() {
        return "Inspector content - chỉ INSPECTOR mới truy cập được";
    }
    
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Endpoint cho ADMIN")
    public String adminEndpoint() {
        return "Admin content - chỉ ADMIN mới truy cập được";
    }
}
