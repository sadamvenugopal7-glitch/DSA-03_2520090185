package com.recommendationengine.dto;

import com.recommendationengine.model.Movie;

/**
 * Data Transfer Object for a single ranked recommendation.
 */
public class MovieRecommendationDTO {

    private int rank;
    private Movie movie;
    private double recommendationScore;
    private double genreMatchScore;
    private double similarityScore;
    private double ratingScore;
    private String whyRecommended;
    private boolean isFavorited;

    public MovieRecommendationDTO() {}

    public MovieRecommendationDTO(Movie movie, double recommendationScore, double genreMatchScore, 
                                  double similarityScore, double ratingScore, String whyRecommended, boolean isFavorited) {
        this.movie = movie;
        this.recommendationScore = Math.round(recommendationScore * 10.0) / 10.0;
        this.genreMatchScore = Math.round(genreMatchScore * 10.0) / 10.0;
        this.similarityScore = Math.round(similarityScore * 10.0) / 10.0;
        this.ratingScore = Math.round(ratingScore * 10.0) / 10.0;
        this.whyRecommended = whyRecommended;
        this.isFavorited = isFavorited;
    }

    public int getRank() { return rank; }
    public void setRank(int rank) { this.rank = rank; }

    public Movie getMovie() { return movie; }
    public void setMovie(Movie movie) { this.movie = movie; }

    public double getRecommendationScore() { return recommendationScore; }
    public void setRecommendationScore(double recommendationScore) { this.recommendationScore = recommendationScore; }

    public double getGenreMatchScore() { return genreMatchScore; }
    public void setGenreMatchScore(double genreMatchScore) { this.genreMatchScore = genreMatchScore; }

    public double getSimilarityScore() { return similarityScore; }
    public void setSimilarityScore(double similarityScore) { this.similarityScore = similarityScore; }

    public double getRatingScore() { return ratingScore; }
    public void setRatingScore(double ratingScore) { this.ratingScore = ratingScore; }

    public String getWhyRecommended() { return whyRecommended; }
    public void setWhyRecommended(String whyRecommended) { this.whyRecommended = whyRecommended; }

    public boolean isFavorited() { return isFavorited; }
    public void setFavorited(boolean favorited) { isFavorited = favorited; }
}
