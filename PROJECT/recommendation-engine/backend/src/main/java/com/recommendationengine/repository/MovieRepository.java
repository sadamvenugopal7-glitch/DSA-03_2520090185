package com.recommendationengine.repository;

import com.recommendationengine.model.Movie;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public interface MovieRepository extends MongoRepository<Movie, String> {

    List<Movie> findByGenresContainingIgnoreCase(String genre);

    @Query("{ '$or': [ { 'title': { '$regex': ?0, '$options': 'i' } }, { 'genres': { '$regex': ?0, '$options': 'i' } }, { 'description': { '$regex': ?0, '$options': 'i' } } ] }")
    List<Movie> searchMovies(String keyword);
}
