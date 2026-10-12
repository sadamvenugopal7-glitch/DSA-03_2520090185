package com.recommendationengine.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

/**
 * Rating Entity stored in MongoDB 'ratings' collection.
 * Uses compound index on (userId, movieId) to guarantee single rating per movie per user.
 */
@Document(collection = "ratings")
@CompoundIndex(name = "user_movie_idx", def = "{'userId': 1, 'movieId': 1}", unique = true)
public class Rating {

    @Id
    private String id;

    private String userId;
    private String movieId;
    private Integer rating;
    private Date createdAt = new Date();

    // Transient field populated for frontend views
    @Transient
    private Movie movie;

    public Rating() {}

    public Rating(String userId, String movieId, Integer rating) {
        this.userId = userId;
        this.movieId = movieId;
        this.rating = rating;
        this.createdAt = new Date();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getMovieId() { return movieId; }
    public void setMovieId(String movieId) { this.movieId = movieId; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Movie getMovie() { return movie; }
    public void setMovie(Movie movie) { this.movie = movie; }
}
