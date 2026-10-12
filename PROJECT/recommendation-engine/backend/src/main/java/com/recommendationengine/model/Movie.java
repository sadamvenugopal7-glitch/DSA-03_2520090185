package com.recommendationengine.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;

/**
 * Movie Entity stored in MongoDB 'movies' collection.
 * Academic Concept: Uses ArrayList<String> for movie genre categories.
 */
@Document(collection = "movies")
public class Movie {

    @Id
    private String id;

    private String title;
    private String description;
    
    // ArrayList concept for holding multiple genres per film
    private ArrayList<String> genres = new ArrayList<>();
    
    private Double rating;
    private Integer releaseYear;
    private String imageUrl;
    private Date createdAt = new Date();

    public Movie() {}

    public Movie(String title, String description, ArrayList<String> genres, Double rating, Integer releaseYear, String imageUrl) {
        this.title = title;
        this.description = description;
        this.genres = (genres != null) ? genres : new ArrayList<>();
        this.rating = rating;
        this.releaseYear = releaseYear;
        this.imageUrl = imageUrl;
        this.createdAt = new Date();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ArrayList<String> getGenres() { return genres; }
    public void setGenres(ArrayList<String> genres) {
        this.genres = (genres != null) ? genres : new ArrayList<>();
    }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReleaseYear() { return releaseYear; }
    public void setReleaseYear(Integer releaseYear) { this.releaseYear = releaseYear; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}
