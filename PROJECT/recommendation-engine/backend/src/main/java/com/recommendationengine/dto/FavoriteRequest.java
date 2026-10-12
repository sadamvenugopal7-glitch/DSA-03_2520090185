package com.recommendationengine.dto;

public class FavoriteRequest {
    private String userId;
    private String movieId;

    public FavoriteRequest() {}

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getMovieId() { return movieId; }
    public void setMovieId(String movieId) { this.movieId = movieId; }
}
