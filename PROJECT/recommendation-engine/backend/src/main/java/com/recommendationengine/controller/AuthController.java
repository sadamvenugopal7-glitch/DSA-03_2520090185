package com.recommendationengine.controller;

import com.recommendationengine.dto.LoginRequest;
import com.recommendationengine.dto.RegisterRequest;
import com.recommendationengine.model.User;
import com.recommendationengine.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        try {
            User user = authService.register(req);
            Map<String, Object> res = new HashMap<>();
            res.put("success", true);
            res.put("message", "User registered successfully!");
            res.put("user", user);
            return ResponseEntity.status(HttpStatus.CREATED).body(res);
        } catch (IllegalArgumentException e) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
        } catch (Exception e) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", "Server error during registration.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            User user = authService.login(req);
            Map<String, Object> res = new HashMap<>();
            res.put("success", true);
            res.put("message", "Login successful!");
            res.put("user", user);
            return ResponseEntity.ok(res);
        } catch (IllegalArgumentException e) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
        }
    }

    @GetMapping("/me/{userId}")
    public ResponseEntity<?> getMe(@PathVariable String userId) {
        return authService.getUserById(userId)
                .map(user -> {
                    Map<String, Object> res = new HashMap<>();
                    res.put("success", true);
                    res.put("user", user);
                    return ResponseEntity.ok(res);
                })
                .orElseGet(() -> {
                    Map<String, Object> err = new HashMap<>();
                    err.put("success", false);
                    err.put("message", "User not found.");
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
                });
    }

    @PutMapping("/preferences/{userId}")
    public ResponseEntity<?> updatePreferences(@PathVariable String userId, @RequestBody Map<String, ArrayList<String>> body) {
        try {
            ArrayList<String> genres = body.get("preferredGenres");
            User updated = authService.updatePreferredGenres(userId, genres);
            Map<String, Object> res = new HashMap<>();
            res.put("success", true);
            res.put("message", "Preferences updated successfully!");
            res.put("user", updated);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
        }
    }
}
