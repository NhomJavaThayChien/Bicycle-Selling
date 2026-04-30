package com.bicycle.selling.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir:uploads/images}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadPath = Paths.get(uploadDir);
        
        // Ensure the directory exists when the application starts
        if (!java.nio.file.Files.exists(uploadPath)) {
            try {
                java.nio.file.Files.createDirectories(uploadPath);
            } catch (java.io.IOException e) {
                System.err.println("Could not create upload directory: " + e.getMessage());
            }
        }
        
        String fullPath = uploadPath.toFile().getAbsolutePath();
        
        // Map /uploads/images/** to the actual file system path
        // For example: URL /uploads/images/abc.jpg -> looks in fullPath/abc.jpg
        registry.addResourceHandler("/uploads/images/**")
                .addResourceLocations("file:///" + fullPath + "/");
    }
}
