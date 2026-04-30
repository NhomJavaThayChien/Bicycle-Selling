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
        String fullPath = uploadPath.toFile().getAbsolutePath();
        
        // Map /uploads/** to the actual file system path
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + fullPath + "/");
                
        // Optional: Also map /uploads/images/** explicitly if needed
        registry.addResourceHandler("/uploads/images/**")
                .addResourceLocations("file:" + fullPath + "/");
    }
}
