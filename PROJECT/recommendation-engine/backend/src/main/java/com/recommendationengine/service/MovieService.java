package com.recommendationengine.service;

import com.recommendationengine.algorithms.SearchAlgorithm;
import com.recommendationengine.algorithms.SortingAlgorithm;
import com.recommendationengine.model.Movie;
import com.recommendationengine.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    /**
     * Retrieves all movies with DSA QuickSort applied.
     */
    public ArrayList<Movie> getAllMovies(String sortBy, String genre) {
        List<Movie> all = movieRepository.findAll();
        ArrayList<Movie> movieList = new ArrayList<>(all);

        // Filter by genre if provided using DSA SearchAlgorithm
        if (genre != null && !genre.trim().isEmpty() && !genre.equalsIgnoreCase("All")) {
            movieList = SearchAlgorithm.filterByGenre(movieList, genre);
        }

        // Apply DSA SortingAlgorithm (QuickSort)
        SortingAlgorithm.sortMovies(movieList, sortBy != null ? sortBy : "rating");

        return movieList;
    }

    public Optional<Movie> getMovieById(String id) {
        return movieRepository.findById(id);
    }

    /**
     * Live search using DSA SearchAlgorithm.
     */
    public ArrayList<Movie> searchMovies(String query) {
        List<Movie> all = movieRepository.findAll();
        ArrayList<Movie> movieList = new ArrayList<>(all);

        if (query == null || query.trim().isEmpty()) {
            SortingAlgorithm.sortMovies(movieList, "rating");
            return movieList;
        }

        ArrayList<Movie> results = SearchAlgorithm.multiFieldSearch(movieList, query);
        SortingAlgorithm.sortMovies(results, "rating");
        return results;
    }

    public ArrayList<Movie> getMoviesByGenre(String genre) {
        List<Movie> all = movieRepository.findAll();
        ArrayList<Movie> movieList = new ArrayList<>(all);
        ArrayList<Movie> filtered = SearchAlgorithm.filterByGenre(movieList, genre);
        SortingAlgorithm.sortMovies(filtered, "rating");
        return filtered;
    }
}
