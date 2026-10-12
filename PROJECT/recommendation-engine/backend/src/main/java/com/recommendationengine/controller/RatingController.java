package com.recommendationengine.controller;

import com.recommendationengine.dto.RatingRequest;
import com.recommendationengine.model.Rating;
import com.recommendationengine.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ratings")
@CrossOrigin(origins = "*")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    @PostMapping
    public ResponseEntity<?> submitRating(@RequestBody RatingRequest req) {
        try {
            Rating rating = ratingService.submitRating(req);
            Map<String, Object> res = new HashMap<>();
            res.put("success", true);
            res.put("message", "Rating submitted successfully!");
            res.put("rating", rating);
            return ResponseEntity.ok(res);
        } catch (IllegalArgumentException e) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserRatings(@PathVariable String userId) {
        List<Rating> ratings = ratingService.getUserRatings(userId);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("count", ratings.size());
        res.put("ratings", ratings);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<?> getMovieStats(@PathVariable String movieId) {
        Map<String, Object> stats = ratingService.getMovieStats(movieId);
        Map<String, Object> res = new HashMap<>(stats);
        res.put("success", true);
        return ResponseEntity.ok(res);
    }
}
