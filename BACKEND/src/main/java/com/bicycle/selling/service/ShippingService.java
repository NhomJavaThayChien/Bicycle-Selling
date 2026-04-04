package com.bicycle.selling.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bicycle.selling.dto.GhnDistrict;
import com.bicycle.selling.dto.GhnProvince;
import com.bicycle.selling.dto.GhnWard;
import com.bicycle.selling.infrastructure.GhnService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ShippingService {
    private final GhnService ghnService;

    public List<GhnProvince> getProvinces() {
        return ghnService.getProvinces();
    }

    public List<GhnDistrict> getDistricts(int provinceId) {
        return ghnService.getDistricts(provinceId);
    }

    public List<GhnWard> getWards(int districtId) {
        return ghnService.getWards(districtId);
    }
}
