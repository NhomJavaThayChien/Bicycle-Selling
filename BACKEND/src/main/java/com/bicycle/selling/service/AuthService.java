package com.bicycle.selling.service;

import com.bicycle.selling.dto.AuthResponse;
import com.bicycle.selling.dto.LoginRequest;
import com.bicycle.selling.dto.RegisterRequest;
import com.bicycle.selling.model.User;
import com.bicycle.selling.repository.UserRepository;
import com.bicycle.selling.security.JwtUtil;
import com.bicycle.selling.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Kiểm tra username đã tồn tại
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username đã tồn tại");
        }
        
        // Kiểm tra email đã tồn tại
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }
        
        // Tạo user mới
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhoneNumber());
        user.setRole(request.getRole());
        user.setCreatedAt(LocalDateTime.now());
        
        User savedUser = userRepository.save(user);
        
        // Tự động đăng nhập sau khi đăng ký
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtil.generateToken(authentication);
        
        return new AuthResponse(
            jwt,
            savedUser.getId(),
            savedUser.getUsername(),
            savedUser.getEmail(),
            savedUser.getRole()
        );
    }
    
    public AuthResponse login(LoginRequest request) {
        Authentication authentication;
        try {
            // Log để debug
            System.out.println("Attempting login for: " + request.getUsernameOrEmail());
            
            boolean userExists = userRepository.existsByUsername(request.getUsernameOrEmail()) || 
                                 userRepository.existsByEmail(request.getUsernameOrEmail());
            
            if (!userExists) {
                throw new RuntimeException("Tài khoản '" + request.getUsernameOrEmail() + "' không tồn tại trong hệ thống");
            }

            authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getUsernameOrEmail(),
                    request.getPassword()
                )
            );
        } catch (BadCredentialsException ex) {
            throw new RuntimeException("Mật khẩu không chính xác");
        } catch (RuntimeException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new RuntimeException("Lỗi hệ thống: " + ex.getMessage());
        }
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtil.generateToken(authentication);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        return new AuthResponse(
            jwt,
            userDetails.getId(),
            userDetails.getUsername(),
            userDetails.getEmail(),
            userDetails.getRole()
        );
    }
}
