package com.recommendationengine.service;

import com.recommendationengine.dto.LoginRequest;
import com.recommendationengine.dto.RegisterRequest;
import com.recommendationengine.model.User;
import com.recommendationengine.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User register(RegisterRequest req) {
        if (req.getName() == null || req.getEmail() == null || req.getPassword() == null) {
            throw new IllegalArgumentException("Name, email, and password are required.");
        }

        if (req.getPassword().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters.");
        }

        if (req.getConfirmPassword() != null && !req.getPassword().equals(req.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match.");
        }

        String email = req.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }

        // BCrypt Password Hashing
        String hashedPassword = passwordEncoder.encode(req.getPassword());

        User user = new User(
                req.getName().trim(),
                email,
                hashedPassword,
                req.getPreferredGenres() != null ? req.getPreferredGenres() : new ArrayList<>()
        );

        return userRepository.save(user);
    }

    public User login(LoginRequest req) {
        if (req.getEmail() == null || req.getPassword() == null) {
            throw new IllegalArgumentException("Email and password are required.");
        }

        String email = req.getEmail().trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        return user;
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public User updatePreferredGenres(String userId, ArrayList<String> genres) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found.");
        }

        User user = userOpt.get();
        user.setPreferredGenres(genres != null ? genres : new ArrayList<>());
        return userRepository.save(user);
    }
}
