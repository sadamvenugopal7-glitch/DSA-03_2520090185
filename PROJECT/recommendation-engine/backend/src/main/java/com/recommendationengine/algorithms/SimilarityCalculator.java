package com.recommendationengine.algorithms;

import java.util.ArrayList;
import java.util.HashSet;

/**
 * ============================================================================
 * DSA COMPONENT: SIMILARITY CALCULATION (JACCARD SIMILARITY)
 * Course: Data Structures and Algorithms - 3 (25CS2103E)
 * ============================================================================
 * 
 * Mathematical Formulation:
 * Jaccard Index J(A, B) = |Intersection(A, B)| / |Union(A, B)|
 * 
 * Data Structures Used:
 * - HashSet<String> for set operations in O(1) average lookup time.
 * - ArrayList<String> input genre lists.
 * 
 * Range:
 * Returns a value between 0.0 (completely disjoint genres) to 1.0 (exact genre match).
 * ============================================================================
 */
public class SimilarityCalculator {

    /**
     * Calculates Jaccard Similarity between user preferred genres and movie genres.
     * 
     * @param userGenres  List of user preferred genres
     * @param movieGenres List of movie genres
     * @return similarity score between 0.0 and 1.0
     */
    public static double calculateJaccardSimilarity(ArrayList<String> userGenres, ArrayList<String> movieGenres) {
        if (userGenres == null || movieGenres == null || userGenres.isEmpty() || movieGenres.isEmpty()) {
            return 0.0;
        }

        // HashSet concept for O(1) membership testing and set intersection
        HashSet<String> userSet = new HashSet<>();
        for (String g : userGenres) {
            userSet.add(g.trim().toLowerCase());
        }

        HashSet<String> movieSet = new HashSet<>();
        for (String g : movieGenres) {
            movieSet.add(g.trim().toLowerCase());
        }

        int intersectionCount = 0;
        for (String genre : movieSet) {
            if (userSet.contains(genre)) {
                intersectionCount++;
            }
        }

        // Union of both sets: Total distinct genres
        HashSet<String> unionSet = new HashSet<>(userSet);
        unionSet.addAll(movieSet);

        if (unionSet.isEmpty()) {
            return 0.0;
        }

        return (double) intersectionCount / unionSet.size();
    }
}
