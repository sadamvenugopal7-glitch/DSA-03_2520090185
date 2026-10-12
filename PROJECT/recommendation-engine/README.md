# 🎬 CineMatch — Recommendation Engine
## Data Structures and Algorithms - 3 (Course Code: 25CS2103E)
### Academic Year: 2026-2027

A full-stack personalized Movie Recommendation Web Application built with **Java, Spring Boot, Maven, MongoDB, HTML5, CSS3, and Vanilla JavaScript**.

This project demonstrates the practical application of core **Data Structures and Algorithms (DSA)** in a real-world software system by implementing a custom **Max-Heap Priority Queue**, **HashMaps**, **HashSets**, **ArrayLists**, **QuickSort**, and **Jaccard Similarity Calculation** in Java.

---

## 🌐 Quick Access URL
The Java Spring Boot backend and web application are currently running:
- **Web Application URL:** [http://localhost:8080](http://localhost:8080)
- **REST API Base URL:** [http://localhost:8080/api](http://localhost:8080/api)
- **Health Check Status:** [http://localhost:8080/api/health](http://localhost:8080/api/health)

---

## 🔑 Test Login Credentials
Pre-seeded in the database for instant testing and viva demonstration:
- **Email:** `alex@example.com`
- **Password:** `password123`
*(Or click the **Auto Fill** button directly on the login page)*

You can also register a brand-new user with custom preferred genres on the **Register** page!

---

## 📁 Project Structure

```text
recommendation-engine/
│
├── frontend/
│   ├── index.html              # Home page (Hero banner, DSA highlights, trending preview)
│   ├── login.html              # User login with demo auto-fill
│   ├── register.html           # User registration with interactive genre selector
│   ├── dashboard.html          # User dashboard & top recommended movies
│   ├── movies.html             # Movie Explorer (live search, genre filter pills, sorting)
│   ├── movie-details.html      # Detailed movie view (synopsis, rating widget, favorites)
│   ├── recommendations.html    # Dedicated DSA Ranked Recommendations & Live Heap Stats
│   ├── profile.html            # Profile page (manage genres, ratings history, favorites)
│   │
│   ├── css/
│   │   └── style.css           # Modern dark cinema platform styling (glassmorphism & responsive)
│   │
│   └── js/
│       ├── api.js              # Fetch API wrapper, ID normalization, toast notifications
│       ├── auth.js             # Authentication state, login, register, route guards
│       ├── movies.js           # Movie explorer, live search, sorting, rating & modal
│       ├── recommendations.js  # MaxHeap Top-K ranking renderer & "Why Recommended" breakdown
│       └── profile.js          # User profile, ratings list, favorites manager
│
├── backend/
│   ├── pom.xml                 # Maven build configuration (Java 17, Spring Boot 3)
│   └── src/
│       └── main/
│           ├── java/
│           │   └── com/recommendationengine/
│           │       ├── RecommendationEngineApplication.java # Spring Boot entry point
│           │       │
│           │       ├── controller/
│           │       │   ├── AuthController.java           # POST /register, POST /login, PUT /preferences
│           │       │   ├── MovieController.java          # GET /movies, GET /search, GET /genre/{genre}
│           │       │   ├── RatingController.java         # POST /ratings, GET /ratings/user/{userId}
│           │       │   ├── FavoriteController.java       # POST /favorites, DELETE /favorites/{movieId}
│           │       │   ├── RecommendationController.java # GET /recommendations/{userId}
│           │       │   └── HealthController.java         # GET /health
│           │       │
│           │       ├── service/
│           │       │   ├── AuthService.java              # BCrypt hashing & authentication
│           │       │   ├── MovieService.java             # Movie retrieval with QuickSort & Search
│           │       │   ├── RatingService.java            # Rating upsert and statistics
│           │       │   ├── FavoriteService.java          # Favorites manager
│           │       │   └── RecommendationService.java    # Coordinates DSA RecommendationEngine
│           │       │
│           │       ├── model/
│           │       │   ├── User.java                     # User entity with ArrayList<String> genres
│           │       │   ├── Movie.java                    # Movie entity with genres, rating, year
│           │       │   ├── Rating.java                   # Rating entity (1-5 stars, compound index)
│           │       │   └── Favorite.java                 # Favorite entity (compound index)
│           │       │
│           │       ├── repository/
│           │       │   ├── UserRepository.java           # Spring Data MongoDB interface
│           │       │   ├── MovieRepository.java          # Spring Data MongoDB interface
│           │       │   ├── RatingRepository.java         # Spring Data MongoDB interface
│           │       │   └── FavoriteRepository.java       # Spring Data MongoDB interface
│           │       │
│           │       ├── dto/
│           │       │   ├── LoginRequest.java
│           │       │   ├── RegisterRequest.java
│           │       │   ├── RatingRequest.java
│           │       │   ├── FavoriteRequest.java
│           │       │   ├── MovieRecommendationDTO.java   # Ranked recommendation data object
│           │       │   └── RecommendationResponse.java   # Response with DSA statistics
│           │       │
│           │       ├── algorithms/
│           │       │   ├── RecommendationEngine.java     # Multi-factor scoring & MaxHeap orchestrator
│           │       │   ├── MaxHeap.java                  # Custom Array-based Max-Heap Priority Queue
│           │       │   ├── SimilarityCalculator.java     # Jaccard Genre Similarity using HashSet
│           │       │   ├── SearchAlgorithm.java          # Linear & Multi-field search on ArrayList
│           │       │   └── SortingAlgorithm.java         # QuickSort implementation on ArrayList
│           │       │
│           │       └── config/
│           │           ├── WebMvcConfig.java             # CORS & static frontend resource mapping
│           │           └── DatabaseSeeder.java           # Auto-seeds 28 sample movies on boot
│           │
│           └── resources/
│               └── application.properties                # Spring Boot port & MongoDB connection
│
├── .env                        # Environment variables (PORT, MONGODB_URI)
└── README.md                   # Full documentation & viva guide
```

---

## 🛠️ Technologies Used

### Frontend
- **HTML5:** Semantic architecture, accessible forms, responsive layout.
- **CSS3:** Modern dark cinema theme, custom responsive grid, glassmorphism cards (`backdrop-filter`), glowing badges, interactive star rating rater.
- **Vanilla JavaScript (ES6+):** Fetch API, DOM manipulation, client-side session management (No heavy frameworks).

### Backend
- **Java 17:** Primary programming language for core DSA algorithms and business logic.
- **Spring Boot 3.2.x:** High-performance RESTful API framework.
- **Spring Data MongoDB:** Object-Document Mapping (ODM) for database operations.
- **BCrypt:** Secure password salting and hashing.
- **Apache Maven 3.9+:** Project build and dependency management.

### Database
- **MongoDB:** NoSQL database (Compatible with Local MongoDB & MongoDB Atlas).

---

## ⚙️ How to Run the Project

### 1. Requirements
- **Java 17** installed (`java -version`)
- **Maven 3.8+** installed (`mvn -version`)
- **MongoDB** running locally on port 27017 **OR** a MongoDB Atlas connection string.

### 2. Environment Configuration (.env)
The project comes pre-configured for local MongoDB in `.env`:
```env
PORT=8080
MONGODB_URI=mongodb://127.0.0.1:27017/recommendation_engine
```

#### To use MongoDB Atlas (Cloud):
1. Open `.env`.
2. Replace `MONGODB_URI` with your Atlas connection string:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/recommendation_engine?retryWrites=true&w=majority
   ```

### 3. Start the Backend & Web Application
From the project root:
```bash
npm start
```
*(Or inside `recommendation-engine/backend`: `mvn spring-boot:run`)*

The Spring Boot server will compile the code, connect to MongoDB, automatically seed the 28 sample movies if empty, and start Tomcat on port **8080**.

### 4. Open in Your Browser
Navigate to:
👉 **[http://localhost:8080](http://localhost:8080)**

---

## 🧠 Comprehensive DSA Viva Guide

### 1. Custom Max-Heap Priority Queue (Top-K Ranking)
* **File:** [`backend/src/main/java/com/recommendationengine/algorithms/MaxHeap.java`](file:///c:/Users/sadam/OneDrive/Desktop/DSA-03/pro/recommendation-engine/backend/src/main/java/com/recommendationengine/algorithms/MaxHeap.java)
* **What it stores:** Instances of `HeapNode<MovieRecommendationDTO>` containing movie data and calculated recommendation score as priority.
* **Array-based Complete Binary Tree indexing:**
  * Parent: `(i - 1) / 2`
  * Left Child: `2 * i + 1`
  * Right Child: `2 * i + 2`
* **Operations & Time Complexity:**
  * `insert()`: Appends element to bottom leaf and calls `heapifyUp()` $\rightarrow \mathbf{O(\log N)}$.
  * `extractMax()`: Swaps root with last leaf, pops, and calls `heapifyDown()` $\rightarrow \mathbf{O(\log N)}$.
  * `peek()`: Returns root element without removal $\rightarrow \mathbf{O(1)}$.
* **Viva Key Point:**
  > *"Instead of sorting all $N$ candidate movies using an $O(N \log N)$ algorithm, our engine pushes candidates into a Max-Heap Priority Queue and extracts only the Top-$K$ recommendations in **$O(K \log N)$** time. This is the optimal asymptotic solution for Top-K queries."*

---

### 2. ArrayList
* **Where used:**
  * `ArrayList<Movie>` to store the candidate movie catalog.
  * `ArrayList<String>` to store multi-value genre feature vectors per film.
  * Internal array backing the `MaxHeap`.
  * `ArrayList<MovieRecommendationDTO>` for top ranked results.
* **Why used:** Provides $O(1)$ random access by index and amortized $O(1)$ dynamic insertions.

---

### 3. HashMap
* **Where used:**
  * `genrePreferenceMap` (`HashMap<String, Double>`): Maps `Genre → User Preference Weight`.
  * `movieScoreMap` (`HashMap<String, Double>`): Maps `MovieId → Computed Recommendation Score`.
* **How it improves the system:**
  * Initializes declared preferences with weight `1.0`.
  * Learns dynamically from ratings:
    * 5-star rating $\rightarrow +0.5$ genre boost.
    * 1-star rating $\rightarrow -0.5$ genre reduction.
  * Provides **$O(1)$** average time complexity for weight updates and lookups.

---

### 4. HashSet
* **Where used:**
  * `ratedMovieIdsSet` (`HashSet<String>`): Stores movie IDs the user has already rated.
  * `favoriteMovieIdsSet` (`HashSet<String>`): Stores favorited movie IDs.
  * `alreadyRecommendedSet` (`HashSet<String>`): Prevents duplicate recommendation output.
* **Why used:** Ensures instantaneous **$O(1)$** membership tests so already-rated films are excluded from fresh candidate recommendations without scanning arrays ($O(N)$).

---

### 5. Similarity Calculation (Jaccard Index)
* **File:** [`backend/src/main/java/com/recommendationengine/algorithms/SimilarityCalculator.java`](file:///c:/Users/sadam/OneDrive/Desktop/DSA-03/pro/recommendation-engine/backend/src/main/java/com/recommendationengine/algorithms/SimilarityCalculator.java)
* **Concept:** Calculates the intersection over union between user genre preferences and candidate movie genres:
  $$J(A, B) = \frac{|A \cap B|}{|A \cup B|}$$
* Uses `HashSet<String>` to perform intersection and union in $O(|A| + |B|)$ linear time.

---

### 6. Searching Algorithm
* **File:** [`backend/src/main/java/com/recommendationengine/algorithms/SearchAlgorithm.java`](file:///c:/Users/sadam/OneDrive/Desktop/DSA-03/pro/recommendation-engine/backend/src/main/java/com/recommendationengine/algorithms/SearchAlgorithm.java)
* Implements multi-field linear filtering matching `title`, `description`, and `genres` in $O(N)$ time.

---

### 7. Sorting Algorithm (QuickSort)
* **File:** [`backend/src/main/java/com/recommendationengine/algorithms/SortingAlgorithm.java`](file:///c:/Users/sadam/OneDrive/Desktop/DSA-03/pro/recommendation-engine/backend/src/main/java/com/recommendationengine/algorithms/SortingAlgorithm.java)
* Implements recursive divide-and-conquer **QuickSort** with Lomuto partition scheme on `ArrayList<Movie>` to sort by:
  * Rating (Descending)
  * Release Year (Descending)
  * Title (Ascending A-Z)
* Average Time Complexity: **$O(N \log N)$**.

---

### 8. Multi-Factor Recommendation Score Formula
Each unrated candidate movie receives a score between **1.0 and 10.0**:

$$\text{Final Score} = (S_{\text{genre}} \times 0.50) + (S_{\text{rating}} \times 0.30) + (S_{\text{similarity}} \times 0.20) + \text{Favorite Bonus}$$

- **$S_{\text{genre}}$ (Genre Match - 50%):** Weighted overlap between the user's genre preference map and the movie's genre tags.
- **$S_{\text{rating}}$ (Global Critic Rating - 30%):** Normalized critic score out of 10.
- **$S_{\text{similarity}}$ (Content Similarity - 20%):** Jaccard Similarity between candidate genres and user high-rated movie profiles.
- **Favorite Bonus (+0.5):** Engagement boost if user marked the movie as a favorite.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user with BCrypt password hashing |
| `POST` | `/api/auth/login` | Authenticate user & validate credentials |
| `GET` | `/api/auth/me/{userId}` | Get user profile |
| `PUT` | `/api/auth/preferences/{userId}` | Update user preferred genres |
| `GET` | `/api/movies` | Get movies (supports `sortBy` and `genre`) |
| `GET` | `/api/movies/{id}` | Get single movie details |
| `GET` | `/api/movies/search?query=` | Search movies by title, description, genre |
| `GET` | `/api/movies/genre/{genre}` | Filter movies by genre |
| `POST` | `/api/ratings` | Submit or update movie rating (1–5 stars) |
| `GET` | `/api/ratings/user/{userId}` | Get all ratings by user |
| `GET` | `/api/ratings/movie/{movieId}` | Get movie rating statistics |
| `POST` | `/api/favorites` | Add movie to user favorites |
| `GET` | `/api/favorites/user/{userId}` | Get all favorites for user |
| `DELETE` | `/api/favorites/{movieId}` | Remove movie from favorites |
| `GET` | `/api/recommendations/{userId}` | **Executes Java MaxHeap Recommendation Engine** |
| `GET` | `/api/health` | Service health status |
