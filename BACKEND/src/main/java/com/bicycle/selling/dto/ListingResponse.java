package com.bicycle.selling.dto;

import com.bicycle.selling.model.enums.BikeCondition;
import com.bicycle.selling.model.enums.InspectionStatus;
import com.bicycle.selling.model.enums.ListingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ListingResponse {
    
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private BikeCondition condition;
    private ListingStatus status;
    private InspectionStatus inspectionStatus;
    
    // Brand & Category
    private String brandName;
    private String categoryName;
    
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
    private String location;
    
    // Additional info
    private String additionalAccessories;
    private String reasonForSelling;
    
    // Stats
    private Integer viewCount;
    private Integer likeCount;
    
    // Seller info
    private Long sellerId;
    private String sellerUsername;
    private String sellerFullName;
    private Double sellerReputation;
    
    // Images
    private List<String> imageUrls;
    private String primaryImageUrl;
    
    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
