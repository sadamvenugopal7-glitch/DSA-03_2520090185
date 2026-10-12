package com.recommendationengine;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RecommendationEngineApplication {

    public static void main(String[] args) {
        SpringApplication.run(RecommendationEngineApplication.class, args);
        System.out.println("==========================================================");
        System.out.println("🚀 CineMatch Recommendation Engine (Java Spring Boot) Ready!");
        System.out.println("🌐 Web Application URL: http://localhost:8080");
        System.out.println("📡 REST API Base URL:  http://localhost:8080/api");
        System.out.println("==========================================================");
    }
}
