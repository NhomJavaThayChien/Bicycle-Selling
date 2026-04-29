package com.bicycle.selling.repository;

import com.bicycle.selling.model.User;
import com.bicycle.selling.model.enums.UserRole;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByUsernameOrEmail(String username, String email);
    
    Boolean existsByUsername(String username);
    
    Boolean existsByEmail(String email);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT u FROM User u WHERE u.id = :id")
    Optional<User> findByIdForUpdate(Long id);

    // Đếm số user theo role (BUYER, SELLER, ADMIN, INSPECTOR)
    long countByRole(UserRole role);

    // Đếm số user thương mại (không tính ADMIN + INSPECTOR)
    @Query("SELECT COUNT(u) FROM User u WHERE u.role IN (com.bicycle.selling.model.enums.UserRole.BUYER, com.bicycle.selling.model.enums.UserRole.SELLER)")
    long countMarketplaceUsers();
}