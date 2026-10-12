package com.recommendationengine.algorithms;

import com.recommendationengine.dto.MovieRecommendationDTO;
import com.recommendationengine.model.Favorite;
import com.recommendationengine.model.Movie;
import com.recommendationengine.model.Rating;
import com.recommendationengine.model.User;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;

/**
 * ============================================================================
 * CORE DSA COMPONENT: RECOMMENDATION ENGINE
 * Course: Data Structures and Algorithms - 3 (25CS2103E)
 * Academic Year: 2026-2027
 * ============================================================================
 * 
 * Data Structures & Algorithms Explicitly Implemented:
 * 1. ArrayList:
 *    - Used for dynamic candidate movies, genre feature vectors, and recommendations list.
 * 2. HashMap (Hash Tables):
 *    - genrePreferenceMap: Maps Genre (String) -> User Preference Weight (Double) in O(1) lookup.
 *    - movieScoreMap: Maps MovieId (String) -> Computed Score (Double).
 * 3. HashSet (Hash Sets):
 *    - ratedMovieIdsSet: O(1) membership testing to avoid recommending already rated films.
 *    - favoriteMovieIdsSet: O(1) lookup to boost favorited movie candidates.
 *    - alreadyRecommendedSet: Deduplication of recommendation results.
 * 4. Priority Queue (Custom MaxHeap):
 *    - Extracts Top-K recommendations in optimal O(K log N) time without full O(N log N) sorting.
 * 5. Similarity Calculation:
 *    - Jaccard Similarity index between user preference profile and candidate genres.
 * 
 * Formula:
 * Recommendation Score = (Genre Match * 0.5) + (Rating Score * 0.3) + (Similarity Score * 0.2) + Favorite Bonus
 * ============================================================================
 */
public class RecommendationEngine {

    /**
     * Builds the user's dynamic genre preference map using HashMap.
     * Incorporates both explicitly declared preferences and feedback from past ratings.
     * 
     * @param user User entity
     * @param ratings List of past ratings by this user
     * @return HashMap<String, Double> mapping each genre to its calculated preference weight
     */
    public static HashMap<String, Double> buildUserGenrePreferenceMap(User user, List<Rating> ratings) {
        // HashMap Concept: Genre -> User Preference Score
        HashMap<String, Double> genrePreferenceMap = new HashMap<>();

        // 1. Initialize with user's explicitly selected favorite genres (baseline weight = 1.0)
        if (user != null && user.getPreferredGenres() != null) {
            for (String genre : user.getPreferredGenres()) {
                if (genre != null && !genre.trim().isEmpty()) {
                    genrePreferenceMap.put(genre.trim().toLowerCase(), 1.0);
                }
            }
        }

        // 2. Adjust dynamically based on user's past ratings (Rating History)
        if (ratings != null) {
            for (Rating r : ratings) {
                if (r.getMovie() != null && r.getMovie().getGenres() != null) {
                    int ratingValue = (r.getRating() != null) ? r.getRating() : 3;
                    // Rating delta: 5 stars -> +0.5, 4 stars -> +0.25, 3 stars -> 0, 2 stars -> -0.25, 1 star -> -0.5
                    double ratingDelta = (ratingValue - 3) * 0.25;

                    for (String g : r.getMovie().getGenres()) {
                        String cleanGenre = g.trim().toLowerCase();
                        double currentWeight = genrePreferenceMap.getOrDefault(cleanGenre, 0.5);
                        double newWeight = Math.max(0.1, Math.min(2.5, currentWeight + ratingDelta));
                        genrePreferenceMap.put(cleanGenre, Math.round(newWeight * 100.0) / 100.0);
                    }
                }
            }
        }

        return genrePreferenceMap;
    }

    /**
     * Generates personalized movie recommendations using MaxHeap Priority Queue.
     * 
     * @param user Current User
     * @param allMovies Catalog of all available movies (ArrayList<Movie>)
     * @param userRatings Past ratings by this user (List<Rating>)
     * @param userFavorites Favorited movies by this user (List<Favorite>)
     * @param limit Maximum number of recommendations to return (Top-K)
     * @return Ranked ArrayList<MovieRecommendationDTO>
     */
    public static ArrayList<MovieRecommendationDTO> generateRecommendations(
            User user,
            ArrayList<Movie> allMovies,
            List<Rating> userRatings,
            List<Favorite> userFavorites,
            int limit) {

        long startTime = System.currentTimeMillis();

        // 1. HashSet: Track already rated movies for O(1) exclusion
        HashSet<String> ratedMovieIdsSet = new HashSet<>();
        if (userRatings != null) {
            for (Rating r : userRatings) {
                if (r.getMovieId() != null) {
                    ratedMovieIdsSet.add(r.getMovieId());
                }
            }
        }

        // 2. HashSet: Track favorites for O(1) heart lookup and bonus
        HashSet<String> favoriteMovieIdsSet = new HashSet<>();
        if (userFavorites != null) {
            for (Favorite f : userFavorites) {
                if (f.getMovieId() != null) {
                    favoriteMovieIdsSet.add(f.getMovieId());
                }
            }
        }

        // 3. HashMap: User Genre Preference Map
        HashMap<String, Double> genrePreferenceMap = buildUserGenrePreferenceMap(user, userRatings);

        // 4. Extract user's highest rated movies (4 or 5 stars) for content similarity
        ArrayList<ArrayList<String>> highRatedGenreProfiles = new ArrayList<>();
        if (userRatings != null) {
            for (Rating r : userRatings) {
                if (r.getRating() != null && r.getRating() >= 4 && r.getMovie() != null && r.getMovie().getGenres() != null) {
                    highRatedGenreProfiles.add(r.getMovie().getGenres());
                }
            }
        }

        // 5. Initialize Max-Heap Priority Queue for Top-K extraction
        MaxHeap<MovieRecommendationDTO> maxHeap = new MaxHeap<>();
        HashMap<String, Double> movieScoreMap = new HashMap<>(); // MovieId -> Recommendation Score

        int candidatesEvaluated = 0;

        // 6. Evaluate all candidate movies in the catalog
        if (allMovies != null) {
            for (Movie movie : allMovies) {
                String movieId = movie.getId();

                // Exclude movies already rated by user to provide fresh discoveries
                if (movieId != null && ratedMovieIdsSet.contains(movieId)) {
                    continue;
                }

                candidatesEvaluated++;

                ArrayList<String> movieGenres = (movie.getGenres() != null) ? movie.getGenres() : new ArrayList<>();

                // --- FACTOR 1: GENRE MATCH SCORE (0.0 to 10.0) ---
                double genreMatchAccumulator = 0.0;
                ArrayList<String> matchedGenreNames = new ArrayList<>();

                for (String g : movieGenres) {
                    String clean = g.trim().toLowerCase();
                    if (genrePreferenceMap.containsKey(clean)) {
                        genreMatchAccumulator += genrePreferenceMap.get(clean);
                        matchedGenreNames.add(g.trim());
                    }
                }

                double genreMatchRatio = movieGenres.isEmpty() ? 0.3 : (genreMatchAccumulator / movieGenres.size());
                double genreMatchScore = Math.min(10.0, genreMatchRatio * 7.5);

                // --- FACTOR 2: RATING SCORE (0.0 to 10.0) ---
                double rawRating = (movie.getRating() != null) ? movie.getRating() : 7.0;
                double ratingScore = Math.min(10.0, Math.max(0.0, rawRating));

                // --- FACTOR 3: SIMILARITY SCORE (0.0 to 10.0) ---
                double maxSimilarity = 0.0;
                if (!highRatedGenreProfiles.isEmpty()) {
                    for (ArrayList<String> highRatedGenres : highRatedGenreProfiles) {
                        double sim = SimilarityCalculator.calculateJaccardSimilarity(movieGenres, highRatedGenres);
                        if (sim > maxSimilarity) {
                            maxSimilarity = sim;
                        }
                    }
                } else if (user != null && user.getPreferredGenres() != null && !user.getPreferredGenres().isEmpty()) {
                    maxSimilarity = SimilarityCalculator.calculateJaccardSimilarity(user.getPreferredGenres(), movieGenres);
                } else {
                    maxSimilarity = 0.5; // neutral fallback
                }
                double similarityScore = maxSimilarity * 10.0;

                // --- FACTOR 4: FAVORITE BONUS (0.5) ---
                boolean isFavorited = (movieId != null) && favoriteMovieIdsSet.contains(movieId);
                double favoriteBonus = isFavorited ? 0.5 : 0.0;

                // --- FINAL SCORE FORMULA ---
                // Recommendation Score = (Genre Match * 0.5) + (Rating Score * 0.3) + (Similarity Score * 0.2) + Bonus
                double rawScore = (genreMatchScore * 0.5) + (ratingScore * 0.3) + (similarityScore * 0.2) + favoriteBonus;
                double finalScore = Math.min(10.0, Math.max(1.0, rawScore));

                if (movieId != null) {
                    movieScoreMap.put(movieId, finalScore);
                }

                // Explainability: "Why Recommended" viva-friendly text
                String whyRecommended;
                if (!matchedGenreNames.isEmpty()) {
                    whyRecommended = "Matches your preference for " + String.join(" & ", matchedGenreNames) + 
                                     " with a strong " + movie.getRating() + "/10 rating.";
                } else {
                    whyRecommended = "Critically acclaimed " + String.join("/", movieGenres) + 
                                     " title trending globally (" + movie.getRating() + "/10).";
                }

                MovieRecommendationDTO dto = new MovieRecommendationDTO(
                        movie, finalScore, genreMatchScore, similarityScore, ratingScore, whyRecommended, isFavorited
                );

                // Insert into Priority Queue (Max-Heap)
                maxHeap.insert(dto, finalScore);
            }
        }

        // 7. Extract Top-K items from the MaxHeap Priority Queue
        // Complexity: O(K log N) where K = limit, N = candidatesEvaluated
        ArrayList<MovieRecommendationDTO> topRecommendations = new ArrayList<>();
        HashSet<String> alreadyRecommendedSet = new HashSet<>(); // Deduplication set

        int k = Math.min(limit, maxHeap.size());
        for (int rank = 1; rank <= k; rank++) {
            MaxHeap.HeapNode<MovieRecommendationDTO> maxNode = maxHeap.extractMax();
            if (maxNode == null) break;

            MovieRecommendationDTO item = maxNode.getData();
            String movieId = item.getMovie().getId();

            if (movieId != null && !alreadyRecommendedSet.contains(movieId)) {
                alreadyRecommendedSet.add(movieId);
                item.setRank(rank);
                topRecommendations.add(item);
            }
        }

        return topRecommendations;
    }
}
