package com.bicycle.selling.infrastructure;

import com.bicycle.selling.dto.GhnDistrict;
import com.bicycle.selling.dto.GhnProvince;
import com.bicycle.selling.dto.GhnResponse;
import com.bicycle.selling.dto.GhnWard;
import com.bicycle.selling.model.BicycleListing;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

@Component
public class GhnService {
    // GHN API integration for fetching provinces, districts, and wards
    @Autowired
    @Qualifier("ghnRestTemplate")
    private RestTemplate restTemplate;

    // Default dimensions and weight for bike shipments
    @Value("${shipping.bike.length}")
    private int length;

    @Value("${shipping.bike.width}")
    private int width;

    @Value("${shipping.bike.height}")
    private int height;

    @Value("${shipping.bike.default-weight}")
    private int defaultWeight;

    // GHN API configuration
    @Value("${ghn.api.token}")
    private String ghnApiToken;

    @Value("${ghn.shop.id}")
    private String ghnShopId;

    @Value("${base.url.ghn.address}")
    private String baseUrlGhnAddress;

    @Value("${base.url.ghn.shipping}")
    private String baseUrlGhnShipping;

    @Value("${base.url.ghn.order}")
    private String baseUrlGhnOrder;

    @Value("${base.url.ghn.cod}")
    private String baseUrlGhnCod;

    // Fetch list of provinces from GHN API
    public List<GhnProvince> getProvinces() {

        String url = baseUrlGhnAddress + "/province";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", ghnApiToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<GhnResponse<List<GhnProvince>>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<>() {
                });

        if (response.getBody() == null || response.getBody().getData() == null) {
            return List.of();
        }
        return response.getBody().getData();
    }

    // Fetch list of districts for a given province from GHN API
    public List<GhnDistrict> getDistricts(int provinceId) {

        String url = baseUrlGhnAddress + "/district?province_id=" + provinceId;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", ghnApiToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<GhnResponse<List<GhnDistrict>>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<>() {
                });

        if (response.getBody() == null || response.getBody().getData() == null) {
            return List.of();
        }
        return response.getBody().getData();
    }

    // Fetch list of wards for a given district from GHN API
    public List<GhnWard> getWards(int districtId) {

        String url = baseUrlGhnAddress + "/ward?district_id=" + districtId;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", ghnApiToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<GhnResponse<List<GhnWard>>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<>() {
                });

        if (response.getBody() == null || response.getBody().getData() == null) {
            return List.of();
        }
        return response.getBody().getData();
    }

    // Ship dementions and weight for bike shipments
    public ShippingDimension resolveDimension(BicycleListing listing) {
        int weight = listing.getWeightKg() != null
                ? listing.getWeightKg().multiply(BigDecimal.valueOf(1000)).intValue()
                : defaultWeight;

        int length, width, height;

        String wheel = listing.getWheelSize();
        wheel = (wheel == null) ? "" : wheel.toLowerCase();

        if (wheel.contains("700c") || wheel.contains("29") || wheel.contains("26") || wheel.contains("27.5")) {
            length = 140;
            width = 20;
            height = 75;
        } else if (wheel.contains("20") || wheel.contains("24")) {
            length = 120;
            width = 20;
            height = 60;
        } else {
            length = this.length;
            width = this.width;
            height = this.height;
        }
        System.out.println("Resolved shipping dimension for listing " + listing.getId() + ": length=" + length
                + ", width=" + width + ", height=" + height + ", weight=" + weight);

        return new ShippingDimension(length, width, height, weight);
    }

    public BigDecimal calculateShippingFee(
            BicycleListing listing,
            int fromDistrictId,
            String fromWardCode,
            int toDistrictId,
            String toWardCode) {

        ShippingDimension d = resolveDimension(listing);

        boolean isHeavy = d.getWeight() >= 20000;
        int serviceTypeId = isHeavy ? 5 : 2;

        Map<String, Object> body = new HashMap<>();

        body.put("service_type_id", serviceTypeId);
        body.put("from_district_id", fromDistrictId);
        body.put("from_ward_code", fromWardCode);
        body.put("to_district_id", toDistrictId);
        body.put("to_ward_code", toWardCode);
        body.put("length", d.getLength());
        body.put("width", d.getWidth());
        body.put("height", d.getHeight());
        body.put("weight", d.getWeight());
        body.put("insurance_value", 0);

        if (isHeavy) {
            List<Map<String, Object>> items = List.of(Map.of(
                    "name", listing.getTitle(),
                    "code", listing.getId().toString(),
                    "quantity", 1,
                    "length", d.getLength(),
                    "width", d.getWidth(),
                    "height", d.getHeight(),
                    "weight", d.getWeight()));

            body.put("items", items);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", ghnApiToken);
        headers.set("ShopId", ghnShopId);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                baseUrlGhnShipping,
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<>() {
                });

        Map<String, Object> responseBody = response.getBody();

        if (responseBody == null || !responseBody.containsKey("data")) {
            throw new RuntimeException("Failed to get shipping fee from GHN");
        }

        Object dataObj = responseBody.get("data");

        if (!(dataObj instanceof Map)) {
            throw new RuntimeException("Invalid GHN response: data is not a map");
        }

        Map<String, Object> data = (Map<String, Object>) dataObj;

        System.out.println("GHN API response data: " + data);

        Object feeObj = data.get("total");
        if (!(feeObj instanceof Number)) {
            throw new RuntimeException("Invalid GHN response: total fee is missing");
        }

        int fee = ((Number) feeObj).intValue();

        return BigDecimal.valueOf(fee);
    }

    public Map<String, Object> createOrder(
            BicycleListing listing,
            int fromDistrictId,
            String fromWardCode,
            int toDistrictId,
            String toWardCode,
            String toName,
            String toPhone,
            String toAddress,
            int codAmount) {

        ShippingDimension d = resolveDimension(listing);

        boolean isHeavy = d.getWeight() >= 20000;
        int serviceTypeId = isHeavy ? 5 : 2;

        Map<String, Object> body = new HashMap<>();

        body.put("payment_type_id", 2);
        body.put("service_type_id", serviceTypeId);
        body.put("required_note", "KHONGCHOXEMHANG");

        body.put("from_district_id", fromDistrictId);
        body.put("from_ward_code", fromWardCode);

        body.put("to_name", toName);
        body.put("to_phone", toPhone);
        body.put("to_address", toAddress);
        body.put("to_district_id", toDistrictId);
        body.put("to_ward_code", toWardCode);

        body.put("weight", d.getWeight());
        body.put("length", d.getLength());
        body.put("width", d.getWidth());
        body.put("height", d.getHeight());
        body.put("content", listing.getTitle());
        body.put("cod_amount", codAmount);
        body.put("client_order_code", "ORDER_" + listing.getId() + "_" + System.currentTimeMillis());

        if (isHeavy) {
            List<Map<String, Object>> items = List.of(Map.of(
                    "name", listing.getTitle(),
                    "code", listing.getId().toString(),
                    "quantity", 1,
                    "price", listing.getPrice().intValue(),
                    "length", d.getLength(),
                    "width", d.getWidth(),
                    "height", d.getHeight(),
                    "weight", d.getWeight()));
            body.put("items", items);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", ghnApiToken);
        headers.set("ShopId", ghnShopId);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                baseUrlGhnOrder,
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<>() {
                });

        Map<String, Object> responseBody = response.getBody();

        if (responseBody == null || !responseBody.containsKey("data")) {
            throw new RuntimeException("Failed to create GHN order");
        }

        Map<String, Object> data = (Map<String, Object>) responseBody.get("data");

        String orderCode = (String) data.get("order_code");
        Number totalFee = (Number) data.get("total_fee");

        Map<String, Object> result = new HashMap<>();
        result.put("order_code", orderCode);
        result.put("total_fee", totalFee != null ? totalFee.intValue() : 0);

        System.out.println("GHN ORDER CREATED: " + result);

        return result;
    }

    public void updateCOD(String ghnOrderCode, int codAmount) {

        String url = baseUrlGhnCod;

        Map<String, Object> body = new HashMap<>();
        body.put("order_code", ghnOrderCode);
        body.put("cod_amount", codAmount);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", ghnApiToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<>() {
                });

        Map<String, Object> responseBody = response.getBody();

        if (responseBody == null) {
            throw new RuntimeException("GHN update COD failed: empty response");
        }

        Integer code = (Integer) responseBody.get("code");
        if (code == null || code != 200) {
            throw new RuntimeException("GHN update COD failed: " + responseBody.get("message"));
        }

        System.out.println("GHN COD updated successfully for order: " + ghnOrderCode + ", new COD: " + codAmount);
    }
}