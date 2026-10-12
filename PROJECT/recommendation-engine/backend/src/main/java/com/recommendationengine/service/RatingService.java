package com.recommendationengine.service;

import com.recommendationengine.dto.RatingRequest;
import com.recommendationengine.model.Movie;
import com.recommendationengine.model.Rating;
import com.recommendationengine.repository.MovieRepository;
import com.recommendationengine.repository.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private MovieRepository movieRepository;

    public Rating submitRating(RatingRequest req) {
        if (req.getUserId() == null || req.getMovieId() == null || req.getRating() == null) {
            throw new IllegalArgumentException("userId, movieId, and rating are required.");
        }

        if (req.getRating() < 1 || req.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5.");
        }

        Optional<Movie> movieOpt = movieRepository.findById(req.getMovieId());
        if (movieOpt.isEmpty()) {
            throw new IllegalArgumentException("Movie not found.");
        }

        Optional<Rating> existingOpt = ratingRepository.findByUserIdAndMovieId(req.getUserId(), req.getMovieId());
        Rating rating;
        if (existingOpt.isPresent()) {
            rating = existingOpt.get();
            rating.setRating(req.getRating());
            rating.setCreatedAt(new Date());
        } else {
            rating = new Rating(req.getUserId(), req.getMovieId(), req.getRating());
        }

        rating = ratingRepository.save(rating);
        rating.setMovie(movieOpt.get());
        return rating;
    }

    public List<Rating> getUserRatings(String userId) {
        List<Rating> ratings = ratingRepository.findByUserId(userId);
        for (Rating r : ratings) {
            if (r.getMovieId() != null) {
                movieRepository.findById(r.getMovieId()).ifPresent(r::setMovie);
            }
        }
        return ratings;
    }

    public Map<String, Object> getMovieStats(String movieId) {
        List<Rating> ratings = ratingRepository.findByMovieId(movieId);
        int count = ratings.size();
        double sum = 0.0;
        for (Rating r : ratings) {
            sum += (r.getRating() != null ? r.getRating() : 0);
        }
        double avg = (count > 0) ? Math.round((sum / count) * 10.0) / 10.0 : 0.0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("movieId", movieId);
        stats.put("count", count);
        stats.put("averageRating", avg);
        return stats;
    }
}
