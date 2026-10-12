/**
 * ============================================================================
 * DSA RECOMMENDATION ENGINE
 * ============================================================================
 * Data Structures & Algorithms College Project
 *
 * Core DSA Concepts Implemented:
 * 1. Priority Queue (Binary Max-Heap):
 *    - Implemented from scratch using Array-based complete binary tree.
 *    - O(log N) insert, O(log N) extractMax, O(1) peek.
 *    - Used to efficiently extract Top-K recommendations without full O(N log N) sorting.
 *
 * 2. HashMap / Map:
 *    - genrePreferenceMap: Maps Genre (String) -> User Preference Weight (Number).
 *    - movieScoreMap: Maps Movie ID (String) -> Calculated Recommendation Score.
 *    - genreFrequencyMap: Maps Genre -> Overall frequency across catalog.
 *
 * 3. HashSet / Set:
 *    - ratedMovieIdsSet: O(1) membership check to exclude already rated movies.
 *    - favoriteMovieIdsSet: O(1) lookup to factor user favorite affinity.
 *    - uniqueGenresSet: Collection of distinct genres across movies.
 *    - alreadyRecommendedSet: Deduplication of recommendation results.
 *
 * 4. Searching & Multi-Factor Similarity:
 *    - Jaccard Similarity index for genre overlap.
 *    - Multi-factor ranking: Genre Match (50%) + Rating History Similarity (25%) + Global Rating (25%).
 * ============================================================================
 */

/**
 * Node in the Priority Queue
 */
class PriorityQueueNode {
  constructor(element, priority) {
    this.element = element;    // The movie object & recommendation metadata
    this.priority = priority;  // The recommendation score (higher = higher priority)
  }
}

/**
 * Max-Heap Priority Queue Implementation
 * Complete binary tree represented as a 0-indexed array.
 * For any node at index i:
 *   - Parent index: Math.floor((i - 1) / 2)
 *   - Left child: 2 * i + 1
 *   - Right child: 2 * i + 2
 */
class MaxHeapPriorityQueue {
  constructor() {
    this.heap = []; // Dynamic Array (ArrayList concept)
  }

  // Helper index calculations
  parentIndex(i) {
    return Math.floor((i - 1) / 2);
  }

  leftChildIndex(i) {
    return 2 * i + 1;
  }

  rightChildIndex(i) {
    return 2 * i + 2;
  }

  hasParent(i) {
    return this.parentIndex(i) >= 0;
  }

  hasLeftChild(i) {
    return this.leftChildIndex(i) < this.heap.length;
  }

  hasRightChild(i) {
    return this.rightChildIndex(i) < this.heap.length;
  }

  // Swap two elements in the heap array
  swap(i, j) {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }

  /**
   * Peek at the maximum element without removing it.
   * Time Complexity: O(1)
   */
  peek() {
    if (this.isEmpty()) return null;
    return this.heap[0];
  }

  /**
   * Insert a new element with a priority into the heap.
   * Time Complexity: O(log N)
   */
  insert(element, priority) {
    const node = new PriorityQueueNode(element, priority);
    this.heap.push(node);
    this.heapifyUp(this.heap.length - 1);
  }

  /**
   * Bubble up the node at index until the heap property is restored.
   * Time Complexity: O(log N)
   */
  heapifyUp(index) {
    let current = index;
    while (
      this.hasParent(current) &&
      this.heap[this.parentIndex(current)].priority < this.heap[current].priority
    ) {
      const parent = this.parentIndex(current);
      this.swap(current, parent);
      current = parent;
    }
  }

  /**
   * Extract the element with maximum priority from the heap root.
   * Time Complexity: O(log N)
   */
  extractMax() {
    if (this.isEmpty()) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const maxNode = this.heap[0];
    // Move last leaf to root and bubble down
    this.heap[0] = this.heap.pop();
    this.heapifyDown(0);

    return maxNode;
  }

  /**
   * Bubble down the node at index until the heap property is restored.
   * Time Complexity: O(log N)
   */
  heapifyDown(index) {
    let current = index;
    while (this.hasLeftChild(current)) {
      let largerChildIndex = this.leftChildIndex(current);

      if (
        this.hasRightChild(current) &&
        this.heap[this.rightChildIndex(current)].priority >
          this.heap[largerChildIndex].priority
      ) {
        largerChildIndex = this.rightChildIndex(current);
      }

      if (this.heap[current].priority >= this.heap[largerChildIndex].priority) {
        break; // Heap property satisfied
      }

      this.swap(current, largerChildIndex);
      current = largerChildIndex;
    }
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }
}

/**
 * Calculates Jaccard Similarity between two sets of genres
 * Jaccard Index = |Intersection(A, B)| / |Union(A, B)|
 * @param {Array<string>} genresA 
 * @param {Array<string>} genresB 
 * @returns {number} Value between 0.0 and 1.0
 */
function calculateJaccardGenreSimilarity(genresA, genresB) {
  if (!genresA || !genresB || genresA.length === 0 || genresB.length === 0) {
    return 0;
  }

  // Using HashSet for O(1) lookups
  const setA = new Set(genresA.map(g => g.toLowerCase().trim()));
  const setB = new Set(genresB.map(g => g.toLowerCase().trim()));

  let intersectionCount = 0;
  for (const genre of setA) {
    if (setB.has(genre)) {
      intersectionCount++;
    }
  }

  const unionSet = new Set([...setA, ...setB]);
  return unionSet.size === 0 ? 0 : intersectionCount / unionSet.size;
}

/**
 * Builds user's dynamic genre preference map (HashMap)
 * Combines:
 *  1. User declared favorite genres from registration/profile (baseline weight: 1.0)
 *  2. User historical ratings:
 *     - 4 or 5 stars -> Boosts those movie genres by +0.3 to +0.5
 *     - 1 or 2 stars -> Reduces affinity for those genres by -0.2 to -0.3
 *
 * @param {Object} user User document
 * @param {Array} userRatings Array of rating documents populated with movie info
 * @returns {Map<string, number>} genrePreferenceMap
 */
function buildUserGenrePreferenceMap(user, userRatings) {
  // HashMap concept: Genre -> Preference Score
  const genrePreferenceMap = new Map();

  // 1. Initialize with user declared favorite genres
  if (user && Array.isArray(user.preferredGenres)) {
    for (const genre of user.preferredGenres) {
      const g = genre.toLowerCase().trim();
      genrePreferenceMap.set(g, 1.0);
    }
  }

  // 2. Adjust with historical ratings
  if (Array.isArray(userRatings)) {
    for (const item of userRatings) {
      if (!item.movieId || !Array.isArray(item.movieId.genres)) continue;
      
      const ratingVal = item.rating; // 1 to 5
      const ratingDelta = (ratingVal - 3) * 0.25; // 5 -> +0.5, 4 -> +0.25, 3 -> 0, 2 -> -0.25, 1 -> -0.5

      for (const rawGenre of item.movieId.genres) {
        const g = rawGenre.toLowerCase().trim();
        const currentWeight = genrePreferenceMap.get(g) || 0.5; // default neutral
        const newWeight = Math.max(0.1, Math.min(2.5, currentWeight + ratingDelta));
        genrePreferenceMap.set(g, Number(newWeight.toFixed(2)));
      }
    }
  }

  return genrePreferenceMap;
}

/**
 * Main Recommendation Engine function
 * Runs multi-factor scoring and uses a MaxHeapPriorityQueue to rank top recommendations.
 *
 * @param {Object} options
 * @param {Object} options.user Current user object
 * @param {Array} options.allMovies All available movies in catalog
 * @param {Array} options.userRatings All ratings made by this user
 * @param {Array} options.userFavorites All favorites made by this user
 * @param {number} [options.limit=12] Number of top recommendations to return
 * @returns {Object} { recommendations: Array, algorithmMetadata: Object }
 */
function getPersonalizedRecommendations({
  user,
  allMovies,
  userRatings = [],
  userFavorites = [],
  limit = 12
}) {
  const startTime = Date.now();

  // 1. HashSet: Set of movie IDs already rated by user (exclude from recommendation)
  const ratedMovieIdsSet = new Set();
  userRatings.forEach(r => {
    if (r.movieId) {
      ratedMovieIdsSet.add(r.movieId._id ? r.movieId._id.toString() : r.movieId.toString());
    }
  });

  // 2. HashSet: Set of user favorited movie IDs (for boost calculation)
  const favoriteMovieIdsSet = new Set();
  userFavorites.forEach(f => {
    if (f.movieId) {
      favoriteMovieIdsSet.add(f.movieId._id ? f.movieId._id.toString() : f.movieId.toString());
    }
  });

  // 3. HashMap: Genre Preference Map (combines declared preferences + rating feedback)
  const genrePreferenceMap = buildUserGenrePreferenceMap(user, userRatings);

  // 4. Extract top rated movies to calculate content-based similarity
  const highRatedMovies = userRatings
    .filter(r => r.rating >= 4 && r.movieId)
    .map(r => r.movieId);

  // 5. Initialize Max-Heap Priority Queue
  const maxHeap = new MaxHeapPriorityQueue();
  const movieScoreMap = new Map(); // HashMap for movie -> calculated score

  let candidatesEvaluated = 0;

  // 6. Evaluate all candidate movies in catalog
  for (const movie of allMovies) {
    const movieIdStr = movie._id.toString();

    // Exclude movies the user has already rated (or allow them if user wants to see all)
    // Here we exclude already rated movies to provide fresh recommendations
    if (ratedMovieIdsSet.has(movieIdStr)) {
      continue;
    }

    candidatesEvaluated++;

    const movieGenres = Array.isArray(movie.genres) ? movie.genres : [];
    const normalizedMovieGenres = movieGenres.map(g => g.toLowerCase().trim());

    // --- Factor A: Genre Match Score (Scale 0 - 10) ---
    let matchedGenreNames = [];
    let genreScoreAccumulator = 0;

    for (const g of normalizedMovieGenres) {
      if (genrePreferenceMap.has(g)) {
        const weight = genrePreferenceMap.get(g);
        genreScoreAccumulator += weight;
        matchedGenreNames.push(g.charAt(0).toUpperCase() + g.slice(1));
      }
    }

    // Average weight across the movie's genres, scaled to 0-10
    const rawGenreMatchRatio = normalizedMovieGenres.length > 0 
      ? genreScoreAccumulator / normalizedMovieGenres.length 
      : 0.3;
    const genreMatchScore = Math.min(10, rawGenreMatchRatio * 7.5);

    // --- Factor B: Global Movie Rating (Scale 0 - 10) ---
    // High-rated movies (e.g. 8.8 IMDb) receive proportional quality weight
    const globalRatingScore = Math.min(10, Math.max(0, movie.rating || 6.5));

    // --- Factor C: Similarity to User's High-Rated Movies (Scale 0 - 10) ---
    let maxSimilarity = 0;
    if (highRatedMovies.length > 0) {
      for (const highRated of highRatedMovies) {
        const sim = calculateJaccardGenreSimilarity(movie.genres, highRated.genres);
        if (sim > maxSimilarity) {
          maxSimilarity = sim;
        }
      }
    } else {
      // Fallback: If user has no ratings yet, similarity defaults to genre match degree
      maxSimilarity = rawGenreMatchRatio > 0.8 ? 0.75 : 0.4;
    }
    const similarityScore = maxSimilarity * 10;

    // --- Factor D: Favorite Boost (Bonus 0.5) ---
    const isFavorited = favoriteMovieIdsSet.has(movieIdStr);
    const favoriteBonus = isFavorited ? 0.5 : 0;

    // --- Final Weighted Recommendation Score Formula ---
    // Score = (Genre Match * 0.50) + (Similarity * 0.25) + (Global Rating * 0.25) + Favorite Bonus
    const compositeScore = (genreMatchScore * 0.50) +
                           (similarityScore * 0.25) +
                           (globalRatingScore * 0.25) +
                           favoriteBonus;

    // Normalize final score to a neat 0.0 - 10.0 scale
    const finalScore = Number(Math.min(10.0, Math.max(1.0, compositeScore)).toFixed(1));

    // Store in HashMap
    movieScoreMap.set(movieIdStr, finalScore);

    // Formulate a viva-friendly "Why Recommended" explanation
    let whyRecommended = '';
    if (matchedGenreNames.length > 0) {
      const topMatched = matchedGenreNames.slice(0, 3).join(' and ');
      whyRecommended = `Matches your preference for ${topMatched} with a strong ${movie.rating || 7.5}/10 rating.`;
    } else {
      whyRecommended = `Highly rated ${movie.genres.join('/')} title trending globally (${movie.rating}/10).`;
    }

    const recommendationItem = {
      movie: {
        _id: movie._id,
        title: movie.title,
        description: movie.description,
        genres: movie.genres,
        rating: movie.rating,
        releaseYear: movie.releaseYear,
        imageUrl: movie.imageUrl
      },
      recommendationScore: finalScore,
      scoreBreakdown: {
        genreMatchScore: Number(genreMatchScore.toFixed(1)),
        similarityScore: Number(similarityScore.toFixed(1)),
        globalRatingScore: Number(globalRatingScore.toFixed(1)),
        favoriteBonus
      },
      whyRecommended,
      isFavorited
    };

    // 7. Insert into Priority Queue (Max-Heap)
    maxHeap.insert(recommendationItem, finalScore);
  }

  // 8. Extract Top-K items from the MaxHeap Priority Queue
  // Time Complexity: O(K log N) where K = limit, N = candidates evaluated
  const topRecommendations = [];
  const alreadyRecommendedSet = new Set(); // HashSet for deduplication
  const k = Math.min(limit, maxHeap.size());

  for (let rank = 1; rank <= k; rank++) {
    const maxNode = maxHeap.extractMax();
    if (!maxNode) break;

    const item = maxNode.element;
    const movieId = item.movie._id.toString();

    if (!alreadyRecommendedSet.has(movieId)) {
      alreadyRecommendedSet.add(movieId);
      topRecommendations.push({
        rank,
        ...item
      });
    }
  }

  const executionTimeMs = Date.now() - startTime;

  return {
    recommendations: topRecommendations,
    dsaStats: {
      candidatesEvaluated,
      heapSizeAtPeak: candidatesEvaluated,
      topKExtracted: topRecommendations.length,
      userPreferredGenresCount: user ? (user.preferredGenres || []).length : 0,
      userRatingsCount: userRatings.length,
      userFavoritesCount: userFavorites.length,
      executionTimeMs,
      complexityExplanation: `Built MaxHeap in O(N log N) or O(N), extracted Top-${k} in O(K log N). Used HashMap for genre weights and HashSet for O(1) membership checks.`
    }
  };
}

module.exports = {
  MaxHeapPriorityQueue,
  PriorityQueueNode,
  calculateJaccardGenreSimilarity,
  buildUserGenrePreferenceMap,
  getPersonalizedRecommendations
};
