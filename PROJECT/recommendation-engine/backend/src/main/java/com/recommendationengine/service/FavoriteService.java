package com.recommendationengine.service;

import com.recommendationengine.dto.FavoriteRequest;
import com.recommendationengine.model.Favorite;
import com.recommendationengine.model.Movie;
import com.recommendationengine.repository.FavoriteRepository;
import com.recommendationengine.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private MovieRepository movieRepository;

    public Favorite addFavorite(FavoriteRequest req) {
        if (req.getUserId() == null || req.getMovieId() == null) {
            throw new IllegalArgumentException("userId and movieId are required.");
        }

        Optional<Movie> movieOpt = movieRepository.findById(req.getMovieId());
        if (movieOpt.isEmpty()) {
            throw new IllegalArgumentException("Movie not found.");
        }

        Optional<Favorite> existing = favoriteRepository.findByUserIdAndMovieId(req.getUserId(), req.getMovieId());
        if (existing.isPresent()) {
            Favorite fav = existing.get();
            fav.setMovie(movieOpt.get());
            return fav;
        }

        Favorite fav = new Favorite(req.getUserId(), req.getMovieId());
        fav = favoriteRepository.save(fav);
        fav.setMovie(movieOpt.get());
        return fav;
    }

    public List<Favorite> getUserFavorites(String userId) {
        List<Favorite> favorites = favoriteRepository.findByUserId(userId);
        for (Favorite f : favorites) {
            if (f.getMovieId() != null) {
                movieRepository.findById(f.getMovieId()).ifPresent(f::setMovie);
            }
        }
        return favorites;
    }

    public boolean removeFavorite(String userId, String movieId) {
        Optional<Favorite> existing = favoriteRepository.findByUserIdAndMovieId(userId, movieId);
        if (existing.isPresent()) {
            favoriteRepository.delete(existing.get());
            return true;
        }
        return false;
    }
}
