package com.recommendationengine.algorithms;

import com.recommendationengine.model.Movie;

import java.util.ArrayList;

/**
 * ============================================================================
 * DSA COMPONENT: SORTING ALGORITHM (QUICKSORT)
 * Course: Data Structures and Algorithms - 3 (25CS2103E)
 * ============================================================================
 * 
 * Concept:
 * Divide-and-Conquer sorting algorithm (QuickSort) applied to an ArrayList<Movie>.
 * 
 * Supported Sort Criteria:
 * 1. "rating"       -> Sort by movie critic score (Descending: High to Low)
 * 2. "releaseYear"  -> Sort by release year (Descending: Newest to Oldest)
 * 3. "title"        -> Sort by movie title (Ascending: Alphabetical A-Z)
 * 
 * Time Complexities for Viva:
 * - Best / Average Case: O(N log N)
 * - Worst Case: O(N^2)
 * - Space Complexity: O(log N) auxiliary recursion stack
 * ============================================================================
 */
public class SortingAlgorithm {

    /**
     * Sorts the provided ArrayList<Movie> in-place based on the sortBy field.
     */
    public static void sortMovies(ArrayList<Movie> movies, String sortBy) {
        if (movies == null || movies.size() <= 1) {
            return;
        }
        quickSort(movies, 0, movies.size() - 1, (sortBy != null) ? sortBy : "rating");
    }

    /**
     * Recursive QuickSort implementation.
     */
    private static void quickSort(ArrayList<Movie> list, int low, int high, String sortBy) {
        if (low < high) {
            int partitionIndex = partition(list, low, high, sortBy);
            quickSort(list, low, partitionIndex - 1, sortBy);
            quickSort(list, partitionIndex + 1, high, sortBy);
        }
    }

    /**
     * Lomuto Partition Scheme.
     */
    private static int partition(ArrayList<Movie> list, int low, int high, String sortBy) {
        Movie pivot = list.get(high);
        int i = low - 1;

        for (int j = low; j < high; j++) {
            if (compareMovies(list.get(j), pivot, sortBy) <= 0) {
                i++;
                swap(list, i, j);
            }
        }

        swap(list, i + 1, high);
        return i + 1;
    }

    /**
     * Compares two movies based on the sorting strategy.
     */
    private static int compareMovies(Movie m1, Movie m2, String sortBy) {
        if (sortBy.equalsIgnoreCase("rating")) {
            // Descending order for rating: higher rating comes first
            double r1 = (m1.getRating() != null) ? m1.getRating() : 0.0;
            double r2 = (m2.getRating() != null) ? m2.getRating() : 0.0;
            return Double.compare(r2, r1);
        } else if (sortBy.equalsIgnoreCase("releaseYear")) {
            // Descending order for releaseYear: newer year comes first
            int y1 = (m1.getReleaseYear() != null) ? m1.getReleaseYear() : 0;
            int y2 = (m2.getReleaseYear() != null) ? m2.getReleaseYear() : 0;
            return Integer.compare(y2, y1);
        } else if (sortBy.equalsIgnoreCase("title")) {
            // Ascending alphabetical order: A to Z
            String t1 = (m1.getTitle() != null) ? m1.getTitle() : "";
            String t2 = (m2.getTitle() != null) ? m2.getTitle() : "";
            return t1.compareToIgnoreCase(t2);
        }
        return 0;
    }

    private static void swap(ArrayList<Movie> list, int i, int j) {
        Movie temp = list.get(i);
        list.set(i, list.get(j));
        list.set(j, temp);
    }
}
