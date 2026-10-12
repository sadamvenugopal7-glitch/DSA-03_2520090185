package com.recommendationengine.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = "*")
public class HealthController {

    @Autowired(required = false)
    private MongoTemplate mongoTemplate;

    @GetMapping
    public ResponseEntity<?> checkHealth() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "healthy");
        status.put("service", "CineMatch Recommendation Engine (Java Spring Boot)");
        status.put("timestamp", new Date().toString());
        status.put("dsaEngine", "Java MaxHeap Priority Queue Ready");

        boolean dbConnected = false;
        try {
            if (mongoTemplate != null) {
                mongoTemplate.getDb().getName();
                dbConnected = true;
            }
        } catch (Exception ignored) {}

        status.put("database", dbConnected ? "connected" : "disconnected");
        return ResponseEntity.ok(status);
    }
}
