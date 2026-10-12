package com.recommendationengine.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

/**
 * Favorite Entity stored in MongoDB 'favorites' collection.
 * Uses compound index on (userId, movieId) to prevent duplicates.
 */
@Document(collection = "favorites")
@CompoundIndex(name = "user_favorite_idx", def = "{'userId': 1, 'movieId': 1}", unique = true)
public class Favorite {

    @Id
    private String id;

    private String userId;
    private String movieId;
    private Date createdAt = new Date();

    // Transient field populated for frontend views
    @Transient
    private Movie movie;

    public Favorite() {}

    public Favorite(String userId, String movieId) {
        this.userId = userId;
        this.movieId = movieId;
        this.createdAt = new Date();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getMovieId() { return movieId; }
    public void setMovieId(String movieId) { this.movieId = movieId; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Movie getMovie() { return movie; }
    public void setMovie(Movie movie) { this.movie = movie; }
}
