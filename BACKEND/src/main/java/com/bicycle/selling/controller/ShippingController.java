package com.bicycle.selling.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bicycle.selling.dto.GhnDistrict;
import com.bicycle.selling.dto.GhnProvince;
import com.bicycle.selling.dto.GhnWard;
import com.bicycle.selling.dto.ShippingRequest;
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
    public List<GhnProvince> getProvinces() {
        return shippingService.getProvinces();
    }

    @GetMapping("/districts/{provinceId}")
    public List<GhnDistrict> getDistricts(@PathVariable int provinceId) {
        return shippingService.getDistricts(provinceId);
    }

    @GetMapping("/wards/{districtId}")
    public List<GhnWard> getWards(@PathVariable int districtId) {
        return shippingService.getWards(districtId);
    }

    @PostMapping("/shipping-fee")
    public BigDecimal calculateShippingFee(@RequestBody ShippingRequest request) {
        return shippingService.calculateShippingFee(request.getListingIds(), request.getFromDistrictId(), request.getFromWardCode(), request.getToDistrictId(), request.getToWardCode());
    }
}
