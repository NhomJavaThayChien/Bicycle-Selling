package com.bicycle.selling.dto;

import com.bicycle.selling.model.enums.BikeCondition;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ListingRequest {
    
    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;
    
    @NotBlank(message = "Mô tả không được để trống")
    private String description;
    
    @NotNull(message = "Giá không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá phải lớn hơn 0")
    private BigDecimal price;
    
    @NotNull(message = "Brand không được để trống")
    private Long brandId;
    
    @NotNull(message = "Category không được để trống")
    private Long categoryId;
    
    @NotNull(message = "Tình trạng xe không được để trống")
    private BikeCondition condition;
    
    // Bicycle specs
    private String frameSize;
    private String frameMaterial;
    private String wheelSize;
    private String brakeType;
    private String gearSystem;
    private Integer yearOfManufacture;
    private String color;
    private Double weight;
    
    // Location
    @NotBlank(message = "Địa chỉ không được để trống")
    private String location;
    
    private String additionalAccessories;
    private String reasonForSelling;
}
