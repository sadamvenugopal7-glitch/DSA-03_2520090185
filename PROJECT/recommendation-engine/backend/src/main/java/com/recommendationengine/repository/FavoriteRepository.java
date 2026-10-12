package com.recommendationengine.repository;

import com.recommendationengine.model.Favorite;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends MongoRepository<Favorite, String> {
    List<Favorite> findByUserId(String userId);
    Optional<Favorite> findByUserIdAndMovieId(String userId, String movieId);
    void deleteByUserIdAndMovieId(String userId, String movieId);
}
