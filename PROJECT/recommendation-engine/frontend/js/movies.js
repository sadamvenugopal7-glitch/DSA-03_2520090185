/**
 * Movie Explorer & Movie Details Modal Controller
 */

let allMoviesCache = [];
let userFavoritesSet = new Set();
let currentFilterGenre = 'All';
let currentSortField = 'rating';
let activeModalMovie = null;
let currentSelectedRating = 5;

document.addEventListener('DOMContentLoaded', async () => {
  await loadUserFavorites();
  await initMovieExplorer();
  initModalListeners();
});

/**
 * Load user favorites into a Set for O(1) heart status checks
 */
async function loadUserFavorites() {
  const user = getCurrentUser();
  if (!user) return;

  const res = await apiRequest(`/favorites/user/${user._id}`);
  if (res.success && Array.isArray(res.favorites)) {
    userFavoritesSet.clear();
    res.favorites.forEach(f => {
      if (f.movieId) {
        userFavoritesSet.add(f.movieId._id || f.movieId);
      }
    });
  }
}

/**
 * Initialize Movie Explorer page
 */
async function initMovieExplorer() {
  const container = document.getElementById('movies-grid');
  if (!container) return;

  // Search input handler with debounce
  const searchInput = document.getElementById('movie-search-input');
  if (searchInput) {
    let timeout = null;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        handleSearch(e.target.value.trim());
      }, 300);
    });
  }

  // Sort dropdown handler
  const sortSelect = document.getElementById('movie-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSortField = e.target.value;
      applySortingAndRender();
    });
  }

  // Genre filter pills
  const genrePills = document.querySelectorAll('.pill-btn');
  genrePills.forEach(pill => {
    pill.addEventListener('click', () => {
      genrePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilterGenre = pill.dataset.genre || 'All';
      filterAndRenderMovies();
    });
  });

  // Initial load
  await fetchMovies();
}

/**
 * Fetch movies from API
 */
async function fetchMovies() {
  const container = document.getElementById('movies-grid');
  if (!container) return;

  container.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
      <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🎬</div>
      <div>Loading movie catalog...</div>
    </div>
  `;

  const res = await apiRequest('/movies');
  if (res.success && Array.isArray(res.movies)) {
    allMoviesCache = res.movies;
    applySortingAndRender();
  } else {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #ef4444;">
        Failed to load movies. Ensure backend is running.
      </div>
    `;
  }
}

/**
 * Search movies live
 */
async function handleSearch(query) {
  const container = document.getElementById('movies-grid');
  if (!container) return;

  if (!query) {
    filterAndRenderMovies();
    return;
  }

  const res = await apiRequest(`/movies/search?query=${encodeURIComponent(query)}`);
  if (res.success && Array.isArray(res.movies)) {
    renderMovieCards(res.movies, container);
    const countDisplay = document.getElementById('movies-count-display');
    if (countDisplay) {
      countDisplay.innerText = `Found ${res.movies.length} result(s) for "${query}"`;
    }
  }
}

/**
 * Filter cached movies by genre
 */
function filterAndRenderMovies() {
  let filtered = [...allMoviesCache];
  if (currentFilterGenre !== 'All') {
    filtered = filtered.filter(m => 
      Array.isArray(m.genres) && m.genres.some(g => g.toLowerCase() === currentFilterGenre.toLowerCase())
    );
  }
  applySortingAndRender(filtered);
}

/**
 * Sort movies and trigger render
 */
function applySortingAndRender(moviesList = null) {
  const list = moviesList || (currentFilterGenre === 'All' ? [...allMoviesCache] : allMoviesCache.filter(m => 
    Array.isArray(m.genres) && m.genres.some(g => g.toLowerCase() === currentFilterGenre.toLowerCase())
  ));

  list.sort((a, b) => {
    if (currentSortField === 'rating') {
      return (b.rating || 0) - (a.rating || 0);
    } else if (currentSortField === 'releaseYear') {
      return (b.releaseYear || 0) - (a.releaseYear || 0);
    } else if (currentSortField === 'title') {
      return (a.title || '').localeCompare(b.title || '');
    }
    return 0;
  });

  const container = document.getElementById('movies-grid');
  if (container) {
    renderMovieCards(list, container);
    const countDisplay = document.getElementById('movies-count-display');
    if (countDisplay) {
      countDisplay.innerText = `Showing ${list.length} movies`;
    }
  }
}

/**
 * Render Movie Cards HTML
 */
function renderMovieCards(movies, container) {
  if (!movies || movies.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
        <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">🔍 No movies found matching your criteria.</p>
        <button class="btn btn-secondary btn-sm" onclick="resetFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = movies.map(movie => {
    const isFavorited = userFavoritesSet.has(movie._id);
    const genresHtml = (movie.genres || []).map(g => `<span class="genre-tag">${g}</span>`).join('');
    
    // Poster fallback in case of network issue
    const safePoster = movie.imageUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';

    return `
      <div class="movie-card" data-movie-id="${movie._id}">
        <div class="poster-wrapper">
          <img src="${safePoster}" alt="${movie.title}" class="poster-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80'" />
          <div class="rating-badge">
            ★ ${(movie.rating || 0).toFixed(1)}
          </div>
          <button class="card-fav-btn ${isFavorited ? 'favorited' : ''}" 
                  onclick="toggleFavorite(event, '${movie._id}')" 
                  title="${isFavorited ? 'Remove Favorite' : 'Add to Favorites'}">
            ♥
          </button>
        </div>
        <div class="movie-info">
          <h3 class="movie-title" title="${movie.title}">${movie.title}</h3>
          <div class="movie-meta">
            <span>📅 ${movie.releaseYear}</span>
            <span>★ ${movie.rating}/10</span>
          </div>
          <div class="genre-tags">
            ${genresHtml}
          </div>
          <div class="card-actions">
            <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="openMovieDetailsModal('${movie._id}')">
              View Details
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function resetFilters() {
  const searchInput = document.getElementById('movie-search-input');
  if (searchInput) searchInput.value = '';
  currentFilterGenre = 'All';
  document.querySelectorAll('.pill-btn').forEach(p => {
    p.classList.toggle('active', p.dataset.genre === 'All');
  });
  filterAndRenderMovies();
}

/**
 * Toggle Favorite for a movie
 */
async function toggleFavorite(event, movieId) {
  event.stopPropagation();
  const user = getCurrentUser();
  if (!user) {
    showToast('Please login to save favorites.', 'info');
    return;
  }

  const isFavorited = userFavoritesSet.has(movieId);

  if (isFavorited) {
    const res = await apiRequest(`/favorites/${movieId}`, 'DELETE', { userId: user._id });
    if (res.success) {
      userFavoritesSet.delete(movieId);
      showToast('Removed from favorites', 'info');
    }
  } else {
    const res = await apiRequest('/favorites', 'POST', { userId: user._id, movieId });
    if (res.success) {
      userFavoritesSet.add(movieId);
      showToast('Added to your favorites!', 'success');
    }
  }

  // Update UI heart button state
  document.querySelectorAll(`.movie-card[data-movie-id="${movieId}"] .card-fav-btn`).forEach(btn => {
    btn.classList.toggle('favorited', userFavoritesSet.has(movieId));
  });

  const modalFavBtn = document.getElementById('modal-fav-btn');
  if (modalFavBtn && activeModalMovie && activeModalMovie._id === movieId) {
    modalFavBtn.innerHTML = userFavoritesSet.has(movieId) ? '♥ Favorited' : '♡ Add to Favorites';
    modalFavBtn.className = userFavoritesSet.has(movieId) ? 'btn btn-accent' : 'btn btn-secondary';
  }
}

/**
 * Open Movie Details Modal
 */
async function openMovieDetailsModal(movieId) {
  const modal = document.getElementById('movie-modal');
  if (!modal) return;

  const movie = allMoviesCache.find(m => m._id === movieId) || (await apiRequest(`/movies/${movieId}`)).movie;
  if (!movie) {
    showToast('Movie details not found', 'error');
    return;
  }

  activeModalMovie = movie;

  document.getElementById('modal-title').innerText = movie.title;
  document.getElementById('modal-year').innerText = movie.releaseYear;
  document.getElementById('modal-rating').innerText = `★ ${movie.rating}/10`;
  document.getElementById('modal-description').innerText = movie.description;
  
  const poster = document.getElementById('modal-poster');
  if (poster) {
    poster.src = movie.imageUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
  }

  const genresContainer = document.getElementById('modal-genres');
  if (genresContainer) {
    genresContainer.innerHTML = (movie.genres || []).map(g => `<span class="badge-tag">${g}</span>`).join('');
  }

  // Update favorite button
  const modalFavBtn = document.getElementById('modal-fav-btn');
  if (modalFavBtn) {
    const isFav = userFavoritesSet.has(movie._id);
    modalFavBtn.innerHTML = isFav ? '♥ Favorited' : '♡ Add to Favorites';
    modalFavBtn.className = isFav ? 'btn btn-accent' : 'btn btn-secondary';
  }

  // Reset star selection
  currentSelectedRating = 5;
  highlightStars(5);

  modal.classList.add('active');
}

/**
 * Initialize Modal Event Listeners
 */
function initModalListeners() {
  const modal = document.getElementById('movie-modal');
  if (!modal) return;

  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  // Modal Favorite button
  const modalFavBtn = document.getElementById('modal-fav-btn');
  if (modalFavBtn) {
    modalFavBtn.addEventListener('click', (e) => {
      if (activeModalMovie) {
        toggleFavorite(e, activeModalMovie._id);
      }
    });
  }

  // Star Rating Interaction
  const stars = document.querySelectorAll('#star-rater .star');
  stars.forEach(star => {
    star.addEventListener('mouseenter', () => {
      const val = parseInt(star.dataset.value, 10);
      highlightStars(val);
    });

    star.addEventListener('mouseleave', () => {
      highlightStars(currentSelectedRating);
    });

    star.addEventListener('click', () => {
      currentSelectedRating = parseInt(star.dataset.value, 10);
      highlightStars(currentSelectedRating);
      const textDisplay = document.getElementById('rating-display-text');
      if (textDisplay) textDisplay.innerText = `${currentSelectedRating} Star${currentSelectedRating > 1 ? 's' : ''}`;
    });
  });

  // Submit Rating button
  const submitRatingBtn = document.getElementById('submit-rating-btn');
  if (submitRatingBtn) {
    submitRatingBtn.addEventListener('click', async () => {
      const user = getCurrentUser();
      if (!user) {
        showToast('Please login to rate movies.', 'info');
        return;
      }
      if (!activeModalMovie) return;

      submitRatingBtn.disabled = true;
      submitRatingBtn.innerText = 'Submitting...';

      const res = await apiRequest('/ratings', 'POST', {
        userId: user._id,
        movieId: activeModalMovie._id,
        rating: currentSelectedRating
      });

      submitRatingBtn.disabled = false;
      submitRatingBtn.innerText = 'Submit Rating';

      if (res.success) {
        showToast(`Rated "${activeModalMovie.title}" ${currentSelectedRating} ★!`, 'success');
        modal.classList.remove('active');
      } else {
        showToast(res.message || 'Error submitting rating.', 'error');
      }
    });
  }
}

function highlightStars(count) {
  const stars = document.querySelectorAll('#star-rater .star');
  stars.forEach(s => {
    const val = parseInt(s.dataset.value, 10);
    s.classList.toggle('selected', val <= count);
  });
}
