package com.bicycle.selling.infrastructure;

import com.bicycle.selling.dto.GhnDistrict;
import com.bicycle.selling.dto.GhnProvince;
import com.bicycle.selling.dto.GhnWard;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

@Service
public class GhnService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${ghn.api.token}")
    private String ghnApiToken;

    @Value("${base.url.ghn.address}")
    private String baseUrlGhnAddress;

    public List<GhnProvince> getProvinces() {

        String url = baseUrlGhnAddress + "/province";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", ghnApiToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<>() {
            });

        List<?> rawList = (List<?>) response.getBody().get("data");

        return rawList.stream()
                .map(item -> objectMapper.convertValue(item, GhnProvince.class))
                .toList();
    }

    public List<GhnDistrict> getDistricts(int provinceId) {

        String url = baseUrlGhnAddress + "/district?province_id=" + provinceId;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", ghnApiToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<>() {
            });

        List<?> rawList = (List<?>) response.getBody().get("data");

        return rawList.stream()
                .map(item -> objectMapper.convertValue(item, GhnDistrict.class))
                .toList();
    }

    public List<GhnWard> getWards(int districtId) {

        String url = baseUrlGhnAddress + "/ward?district_id=" + districtId;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", ghnApiToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<>() {
            });

        List<?> rawList = (List<?>) response.getBody().get("data");

        return rawList.stream()
                .map(item -> objectMapper.convertValue(item, GhnWard.class))
                .toList();
    }
}