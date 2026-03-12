package com.bicycle.selling.controller;

import com.bicycle.selling.model.Bicycle;
import com.bicycle.selling.service.BicycleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bicycles")
@RequiredArgsConstructor
public class BicycleController {

    private final BicycleService bicycleService;

    @GetMapping
    public List<Bicycle> getAllBicycles() {
        return bicycleService.getAllBicycles();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bicycle> getBicycleById(@PathVariable Long id) {
        return bicycleService.getBicycleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Bicycle createBicycle(@RequestBody Bicycle bicycle) {
        return bicycleService.createBicycle(bicycle);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBicycle(@PathVariable Long id) {
        bicycleService.deleteBicycle(id);
        return ResponseEntity.noContent().build();
    }
}
