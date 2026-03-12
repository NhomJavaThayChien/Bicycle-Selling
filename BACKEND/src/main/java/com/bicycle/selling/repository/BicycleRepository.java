package com.bicycle.selling.repository;

import com.bicycle.selling.model.Bicycle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BicycleRepository extends JpaRepository<Bicycle, Long> {
    List<Bicycle> findByBrand(String brand);
    List<Bicycle> findByIsSoldFalse();
}
