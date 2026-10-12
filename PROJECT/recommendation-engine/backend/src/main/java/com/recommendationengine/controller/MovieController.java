package com.recommendationengine.controller;

import com.recommendationengine.model.Movie;
import com.recommendationengine.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "*")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @GetMapping
    public ResponseEntity<?> getAllMovies(
            @RequestParam(required = false, defaultValue = "rating") String sortBy,
            @RequestParam(required = false) String genre) {
        ArrayList<Movie> movies = movieService.getAllMovies(sortBy, genre);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("count", movies.size());
        res.put("movies", movies);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMovieById(@PathVariable String id) {
        return movieService.getMovieById(id)
                .map(movie -> {
                    Map<String, Object> res = new HashMap<>();
                    res.put("success", true);
                    res.put("movie", movie);
                    return ResponseEntity.ok(res);
                })
                .orElseGet(() -> {
                    Map<String, Object> err = new HashMap<>();
                    err.put("success", false);
                    err.put("message", "Movie not found.");
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
                });
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchMovies(@RequestParam(required = false) String query) {
        ArrayList<Movie> movies = movieService.searchMovies(query);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("query", query);
        res.put("count", movies.size());
        res.put("movies", movies);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/genre/{genre}")
    public ResponseEntity<?> getMoviesByGenre(@PathVariable String genre) {
        ArrayList<Movie> movies = movieService.getMoviesByGenre(genre);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("genre", genre);
        res.put("count", movies.size());
        res.put("movies", movies);
        return ResponseEntity.ok(res);
    }
}
