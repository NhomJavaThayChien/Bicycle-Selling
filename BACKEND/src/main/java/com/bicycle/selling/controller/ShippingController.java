package com.bicycle.selling.controller;

import java.util.List;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bicycle.selling.dto.CreateShippingOrderRequest;
import com.bicycle.selling.dto.GhnDistrict;
import com.bicycle.selling.dto.GhnProvince;
import com.bicycle.selling.dto.GhnWard;
import com.bicycle.selling.dto.ShippingFee;
import com.bicycle.selling.dto.ShippingOrderResponse;
import com.bicycle.selling.service.ShippingService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/shipping")
@AllArgsConstructor
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

    @GetMapping("/fee")
    public ShippingFee calculateShippingFee(
            @RequestParam Long listingId,
            @RequestParam int fromDistrictId,
            @RequestParam String fromWardCode,
            @RequestParam int toDistrictId,
            @RequestParam String toWardCode) {

        System.out.println("Received shipping fee request: " + listingId);
        return shippingService.calculateShippingFee(
                listingId,
                fromDistrictId,
                fromWardCode,
                toDistrictId,
                toWardCode);
    }

    @PostMapping("/create")
    public ShippingOrderResponse createShippingOrder(@Validated @RequestBody CreateShippingOrderRequest request) {
        return shippingService.createShippingOrder(request);
    }
}
