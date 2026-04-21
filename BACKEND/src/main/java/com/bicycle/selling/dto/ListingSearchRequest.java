package com.bicycle.selling.dto;

import com.bicycle.selling.model.enums.BikeCondition;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ListingSearchRequest {
    
    private String keyword;
    private Long brandId;
    private Long categoryId;
    private BikeCondition condition;
    private BigDecimal priceMin;
    private BigDecimal priceMax;
    private String frameSize;
    
    // Pagination
    private Integer page = 0;
    private Integer size = 20;
    private String sortBy = "createdAt";
    private String sortDir = "desc";
}
