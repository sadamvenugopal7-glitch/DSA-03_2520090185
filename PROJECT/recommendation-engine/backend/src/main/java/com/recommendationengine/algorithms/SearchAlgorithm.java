package com.recommendationengine.algorithms;

import com.recommendationengine.model.Movie;

import java.util.ArrayList;

/**
 * ============================================================================
 * DSA COMPONENT: SEARCHING ALGORITHM
 * Course: Data Structures and Algorithms - 3 (25CS2103E)
 * ============================================================================
 * 
 * Concept:
 * Implements linear search and substring keyword filtering over an ArrayList<Movie>.
 * 
 * Search Criteria Supported:
 * 1. Title Search (case-insensitive substring match)
 * 2. Genre Search (case-insensitive exact or substring match)
 * 3. Multi-Field Keyword Search (Title + Description + Genres)
 * 
 * Time Complexity for Viva:
 * - Linear Search: O(N * M) where N = number of movies, M = length of string
 * ============================================================================
 */
public class SearchAlgorithm {

    /**
     * Search movies by title (case-insensitive).
     */
    public static ArrayList<Movie> searchByTitle(ArrayList<Movie> movies, String query) {
        ArrayList<Movie> results = new ArrayList<>();
        if (movies == null || query == null || query.trim().isEmpty()) {
            return (movies != null) ? movies : results;
        }

        String lowerQuery = query.trim().toLowerCase();
        for (Movie movie : movies) {
            if (movie.getTitle() != null && movie.getTitle().toLowerCase().contains(lowerQuery)) {
                results.add(movie);
            }
        }
        return results;
    }

    /**
     * Filter movies by specific genre.
     */
    public static ArrayList<Movie> filterByGenre(ArrayList<Movie> movies, String targetGenre) {
        ArrayList<Movie> results = new ArrayList<>();
        if (movies == null || targetGenre == null || targetGenre.equalsIgnoreCase("All")) {
            return (movies != null) ? movies : results;
        }

        String lowerTarget = targetGenre.trim().toLowerCase();
        for (Movie movie : movies) {
            if (movie.getGenres() != null) {
                for (String g : movie.getGenres()) {
                    if (g.trim().equalsIgnoreCase(lowerTarget)) {
                        results.add(movie);
                        break;
                    }
                }
            }
        }
        return results;
    }

    /**
     * Multi-field search across title, description, and genres.
     */
    public static ArrayList<Movie> multiFieldSearch(ArrayList<Movie> movies, String keyword) {
        ArrayList<Movie> results = new ArrayList<>();
        if (movies == null || keyword == null || keyword.trim().isEmpty()) {
            return (movies != null) ? movies : results;
        }

        String lowerKeyword = keyword.trim().toLowerCase();
        for (Movie movie : movies) {
            boolean matched = false;

            // Check title
            if (movie.getTitle() != null && movie.getTitle().toLowerCase().contains(lowerKeyword)) {
                matched = true;
            }

            // Check description
            if (!matched && movie.getDescription() != null && movie.getDescription().toLowerCase().contains(lowerKeyword)) {
                matched = true;
            }

            // Check genres
            if (!matched && movie.getGenres() != null) {
                for (String g : movie.getGenres()) {
                    if (g.toLowerCase().contains(lowerKeyword)) {
                        matched = true;
                        break;
                    }
                }
            }

            if (matched) {
                results.add(movie);
            }
        }
        return results;
    }
}
