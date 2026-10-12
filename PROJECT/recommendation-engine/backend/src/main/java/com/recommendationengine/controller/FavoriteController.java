package com.recommendationengine.controller;

import com.recommendationengine.dto.FavoriteRequest;
import com.recommendationengine.model.Favorite;
import com.recommendationengine.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "*")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @PostMapping
    public ResponseEntity<?> addFavorite(@RequestBody FavoriteRequest req) {
        try {
            Favorite favorite = favoriteService.addFavorite(req);
            Map<String, Object> res = new HashMap<>();
            res.put("success", true);
            res.put("message", "Movie added to favorites!");
            res.put("favorite", favorite);
            return ResponseEntity.status(HttpStatus.CREATED).body(res);
        } catch (IllegalArgumentException e) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserFavorites(@PathVariable String userId) {
        List<Favorite> favorites = favoriteService.getUserFavorites(userId);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("count", favorites.size());
        res.put("favorites", favorites);
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/{movieId}")
    public ResponseEntity<?> removeFavorite(
            @PathVariable String movieId,
            @RequestParam(required = false) String userId,
            @RequestBody(required = false) Map<String, String> body) {
        String effectiveUserId = userId;
        if (effectiveUserId == null && body != null) {
            effectiveUserId = body.get("userId");
        }

        if (effectiveUserId == null) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", "userId is required.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
        }

        boolean removed = favoriteService.removeFavorite(effectiveUserId, movieId);
        Map<String, Object> res = new HashMap<>();
        res.put("success", removed);
        res.put("message", removed ? "Movie removed from favorites." : "Favorite not found.");
        return ResponseEntity.ok(res);
    }
}
