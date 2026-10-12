package com.recommendationengine.repository;

import com.recommendationengine.model.Rating;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends MongoRepository<Rating, String> {
    List<Rating> findByUserId(String userId);
    List<Rating> findByMovieId(String movieId);
    Optional<Rating> findByUserIdAndMovieId(String userId, String movieId);
}
