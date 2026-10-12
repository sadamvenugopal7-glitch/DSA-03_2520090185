package com.recommendationengine.service;

import com.recommendationengine.algorithms.RecommendationEngine;
import com.recommendationengine.dto.MovieRecommendationDTO;
import com.recommendationengine.dto.RecommendationResponse;
import com.recommendationengine.model.Favorite;
import com.recommendationengine.model.Movie;
import com.recommendationengine.model.Rating;
import com.recommendationengine.model.User;
import com.recommendationengine.repository.FavoriteRepository;
import com.recommendationengine.repository.MovieRepository;
import com.recommendationengine.repository.RatingRepository;
import com.recommendationengine.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class RecommendationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private FavoriteRepository favoriteRepository;

    public RecommendationResponse getPersonalizedRecommendations(String userId, int limit) {
        long startTime = System.currentTimeMillis();

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found.");
        }
        User user = userOpt.get();

        // 1. Fetch all movies catalog into an ArrayList
        List<Movie> allList = movieRepository.findAll();
        ArrayList<Movie> allMovies = new ArrayList<>(allList);

        // 2. Fetch user's rating history and populate movie data
        List<Rating> ratings = ratingRepository.findByUserId(userId);
        for (Rating r : ratings) {
            if (r.getMovieId() != null) {
                movieRepository.findById(r.getMovieId()).ifPresent(r::setMovie);
            }
        }

        // 3. Fetch user's favorites
        List<Favorite> favorites = favoriteRepository.findByUserId(userId);

        // 4. Execute Core Java DSA RecommendationEngine
        ArrayList<MovieRecommendationDTO> recommendations = RecommendationEngine.generateRecommendations(
                user, allMovies, ratings, favorites, limit > 0 ? limit : 12
        );

        long executionTimeMs = System.currentTimeMillis() - startTime;

        // 5. Build Academic DSA Statistics for Viva Examination
        HashMap<String, Object> dsaStats = new HashMap<>();
        dsaStats.put("candidatesEvaluated", allMovies.size() - ratings.size());
        dsaStats.put("heapSizeAtPeak", allMovies.size() - ratings.size());
        dsaStats.put("topKExtracted", recommendations.size());
        dsaStats.put("userRatingsCount", ratings.size());
        dsaStats.put("userFavoritesCount", favorites.size());
        dsaStats.put("executionTimeMs", executionTimeMs);
        dsaStats.put("complexityExplanation", 
            "Built custom MaxHeap in O(N log N) / O(N), extracted Top-" + recommendations.size() + 
            " in O(K log N). Used HashMap for genre weights and HashSet for O(1) membership exclusions.");

        return new RecommendationResponse(true, user.getId(), user.getName(), recommendations, dsaStats);
    }
}
