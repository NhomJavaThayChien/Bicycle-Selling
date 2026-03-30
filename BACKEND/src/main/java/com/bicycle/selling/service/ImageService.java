package com.bicycle.selling.service;

import com.bicycle.selling.model.BicycleListing;
import com.bicycle.selling.model.ListingImage;
import com.bicycle.selling.repository.BicycleListingRepository;
import com.bicycle.selling.repository.ListingImageRepository;
import com.bicycle.selling.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageService {
    
    private final BicycleListingRepository listingRepository;
    private final ListingImageRepository imageRepository;
    
    @Value("${file.upload-dir:uploads/images}")
    private String uploadDir;
    
    @Value("${file.max-size:10485760}") // 10MB
    private long maxFileSize;
    
    private static final List<String> ALLOWED_EXTENSIONS = List.of("jpg", "jpeg", "png", "webp");
    
    @Transactional
    public List<String> uploadImages(Long listingId, List<MultipartFile> files) throws IOException {
        UserDetailsImpl currentUser = getCurrentUser();
        
        // Check ownership
        BicycleListing listing = listingRepository.findByIdAndSellerId(listingId, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Listing not found or you don't have permission"));
        
        // Check max images (10 per listing)
        List<ListingImage> existingImages = imageRepository.findByListingIdOrderByIsPrimaryDescUploadedAtAsc(listingId);
        if (existingImages.size() + files.size() > 10) {
            throw new RuntimeException("Maximum 10 images per listing");
        }
        
        List<String> uploadedUrls = new ArrayList<>();
        
        // Create upload directory if not exists
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        boolean isFirstImage = existingImages.isEmpty();
        
        for (MultipartFile file : files) {
            // Validate file
            validateFile(file);
            
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1);
            String filename = UUID.randomUUID().toString() + "." + extension;
            
            // Save file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Create image URL (in production, this would be CDN URL)
            String imageUrl = "/uploads/images/" + filename;
            
            // Save to database
            ListingImage image = new ListingImage();
            image.setListing(listing);
            image.setImageUrl(imageUrl);
            image.setPrimary(isFirstImage && uploadedUrls.isEmpty());
            image.setUploadedAt(LocalDateTime.now());
            
            imageRepository.save(image);
            uploadedUrls.add(imageUrl);
        }
        
        return uploadedUrls;
    }
    
    @Transactional
    public void deleteImage(Long listingId, Long imageId) {
        UserDetailsImpl currentUser = getCurrentUser();
        
        // Check ownership
        BicycleListing listing = listingRepository.findByIdAndSellerId(listingId, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Listing not found or you don't have permission"));
        
        ListingImage image = imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));
        
        if (!image.getListing().getId().equals(listingId)) {
            throw new RuntimeException("Image does not belong to this listing");
        }
        
        // Delete file from disk
        try {
            String filename = image.getImageUrl().substring(image.getImageUrl().lastIndexOf("/") + 1);
            Path filePath = Paths.get(uploadDir).resolve(filename);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Log error but continue
        }
        
        // Delete from database
        imageRepository.delete(image);
        
        // If deleted image was primary, set another image as primary
        if (image.isPrimary()) {
            List<ListingImage> remainingImages = imageRepository.findByListingIdOrderByIsPrimaryDescUploadedAtAsc(listingId);
            if (!remainingImages.isEmpty()) {
                ListingImage newPrimary = remainingImages.get(0);
                newPrimary.setPrimary(true);
                imageRepository.save(newPrimary);
            }
        }
    }
    
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }
        
        if (file.getSize() > maxFileSize) {
            throw new RuntimeException("File size exceeds maximum limit of 10MB");
        }
        
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.contains(".")) {
            throw new RuntimeException("Invalid file name");
        }
        
        String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new RuntimeException("Only JPG, JPEG, PNG, and WEBP files are allowed");
        }
    }
    
    private UserDetailsImpl getCurrentUser() {
        return (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
