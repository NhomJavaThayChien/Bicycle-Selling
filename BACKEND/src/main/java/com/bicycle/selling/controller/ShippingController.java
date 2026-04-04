package com.bicycle.selling.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bicycle.selling.dto.GhnDistrict;
import com.bicycle.selling.dto.GhnProvince;
import com.bicycle.selling.dto.GhnWard;
import com.bicycle.selling.service.ShippingService;

import lombok.AllArgsConstructor;

@Controller
@RestController
@RequestMapping("/api/shipping")
@AllArgsConstructor
@Validated
public class ShippingController {
    private final ShippingService shippingService;

    @GetMapping("/provinces")
    public ResponseEntity<?> getProvinces() {
        try {
            List<GhnProvince> provinces = shippingService.getProvinces();
            return ResponseEntity.ok(provinces);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/districts/{provinceId}")
    public ResponseEntity<?> getDistricts(@PathVariable int provinceId) {
        try {
            List<GhnDistrict> districts = shippingService.getDistricts(provinceId);
            return ResponseEntity.ok(districts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/wards/{districtId}")
    public ResponseEntity<?> getWards(@PathVariable int districtId) {
        try {
            List<GhnWard> wards = shippingService.getWards(districtId);
            return ResponseEntity.ok(wards);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
