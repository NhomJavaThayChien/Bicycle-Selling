package com.bicycle.selling.service;

import com.bicycle.selling.model.Bicycle;
import com.bicycle.selling.repository.BicycleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BicycleService {

    private final BicycleRepository bicycleRepository;

    public List<Bicycle> getAllBicycles() {
        return bicycleRepository.findAll();
    }

    public Optional<Bicycle> getBicycleById(Long id) {
        return bicycleRepository.findById(id);
    }

    public List<Bicycle> getAvailableBicycles() {
        return bicycleRepository.findByIsSoldFalse();
    }

    @Transactional
    public Bicycle createBicycle(Bicycle bicycle) {
        return bicycleRepository.save(bicycle);
    }

    @Transactional
    public void deleteBicycle(Long id) {
        bicycleRepository.deleteById(id);
    }
}
