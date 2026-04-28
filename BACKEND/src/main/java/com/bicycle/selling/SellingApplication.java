package com.bicycle.selling;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.bicycle.selling.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class SellingApplication {

	public static void main(String[] args) {
		SpringApplication.run(SellingApplication.class, args);
		System.out.println("Bicycle Selling Application is running...");
	}

	@Bean
	public CommandLineRunner resetPasswords(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			String[] usernames = {"inspector_nam", "inspector_linh", "admin", "seller_thanh", "seller_lan", "buyer_minh", "buyer_hoa"};
			for (String username : usernames) {
				userRepository.findByUsername(username).ifPresent(user -> {
					user.setPassword(passwordEncoder.encode("123456"));
					userRepository.save(user);
					System.out.println("Password reset for user: " + username);
				});
			}
		};
	}
}
