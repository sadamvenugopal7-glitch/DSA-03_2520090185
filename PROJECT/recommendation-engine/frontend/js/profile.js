/**
 * User Profile Page Controller
 * Displays user preferences, submitted ratings, and favorited movies.
 */

const ALL_GENRES = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Thriller', 'Romance', 'Animation', 'Adventure'];

document.addEventListener('DOMContentLoaded', async () => {
  const user = requireAuth();
  if (!user) return;

  await loadUserProfile(user);
});

async function loadUserProfile(user) {
  // Update header info
  document.getElementById('profile-name').innerText = user.name || 'Movie Fan';
  document.getElementById('profile-email').innerText = user.email || '';
  
  // Render Preferred Genres
  renderGenreChips(user.preferredGenres || []);

  // Fetch fresh user ratings and favorites in parallel
  const [ratingsRes, favoritesRes] = await Promise.all([
    apiRequest(`/ratings/user/${user._id}`),
    apiRequest(`/favorites/user/${user._id}`)
  ]);

  renderUserRatings(ratingsRes.success ? ratingsRes.ratings : []);
  renderUserFavorites(favoritesRes.success ? favoritesRes.favorites : []);
}

/**
 * Render Preferred Genres with interactive toggle & save
 */
function renderGenreChips(currentGenres) {
  const container = document.getElementById('profile-genres-container');
  if (!container) return;

  const currentSet = new Set((currentGenres || []).map(g => g.toLowerCase()));

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div style="display: flex; flex-wrap: wrap; gap: 0.6rem;">
        ${ALL_GENRES.map(genre => {
          const isSelected = currentSet.has(genre.toLowerCase());
          return `
            <button type="button" 
                    class="btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}" 
                    data-genre="${genre}"
                    onclick="toggleGenrePreference('${genre}')">
              ${isSelected ? '✓ ' : '+ '}${genre}
            </button>
          `;
        }).join('')}
      </div>
      <div>
        <button id="save-genres-btn" class="btn btn-primary btn-sm" onclick="saveUserGenres()">
          Save Preferences
        </button>
      </div>
    </div>
  `;
}

function toggleGenrePreference(genre) {
  const btn = document.querySelector(`button[data-genre="${genre}"]`);
  if (!btn) return;

  const isPrimary = btn.classList.contains('btn-primary');
  if (isPrimary) {
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-secondary');
    btn.innerText = `+ ${genre}`;
  } else {
    btn.classList.remove('btn-secondary');
    btn.classList.add('btn-primary');
    btn.innerText = `✓ ${genre}`;
  }
}

async function saveUserGenres() {
  const user = getCurrentUser();
  if (!user) return;

  const selectedButtons = document.querySelectorAll('button[data-genre].btn-primary');
  const selectedGenres = Array.from(selectedButtons).map(b => b.dataset.genre);

  const saveBtn = document.getElementById('save-genres-btn');
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerText = 'Saving...';
  }

  const res = await apiRequest(`/auth/preferences/${user._id}`, 'PUT', {
    preferredGenres: selectedGenres
  });

  if (saveBtn) {
    saveBtn.disabled = false;
    saveBtn.innerText = 'Save Preferences';
  }

  if (res.success && res.user) {
    setCurrentUser(res.user);
    showToast('Preferences updated! Recommendations will recalculate.', 'success');
  } else {
    showToast(res.message || 'Error updating preferences.', 'error');
  }
}

/**
 * Render Submitted Ratings
 */
function renderUserRatings(ratings) {
  const container = document.getElementById('profile-ratings-list');
  const countBadge = document.getElementById('ratings-count-badge');
  if (!container) return;

  if (countBadge) countBadge.innerText = ratings.length;

  if (!ratings || ratings.length === 0) {
    container.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
        You haven't rated any movies yet. Visit the <a href="movies.html" style="color: var(--primary); text-decoration: underline;">Movies Explorer</a> to rate films!
      </div>
    `;
    return;
  }

  container.innerHTML = ratings.map(r => {
    const movie = r.movieId;
    if (!movie) return '';

    const starsHtml = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
    const dateStr = new Date(r.createdAt || Date.now()).toLocaleDateString();

    return `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); margin-bottom: 0.75rem;">
        <div>
          <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.2rem;">${movie.title}</h4>
          <div style="font-size: 0.8rem; color: var(--text-muted);">
            Rated on ${dateStr} • ${(movie.genres || []).join(', ')}
          </div>
        </div>
        <div style="text-align: right;">
          <div style="color: #fbbf24; font-size: 1.25rem; letter-spacing: 2px;">${starsHtml}</div>
          <span style="font-size: 0.8rem; color: var(--text-dim);">${r.rating} / 5 Stars</span>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Render Favorited Movies
 */
function renderUserFavorites(favorites) {
  const container = document.getElementById('profile-favorites-grid');
  const countBadge = document.getElementById('favorites-count-badge');
  if (!container) return;

  if (countBadge) countBadge.innerText = favorites.length;

  if (!favorites || favorites.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 2rem; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
        No favorites added yet. Click the heart icon on any movie card to add it to your favorites list.
      </div>
    `;
    return;
  }

  container.innerHTML = favorites.map(f => {
    const movie = f.movieId;
    if (!movie) return '';

    const safePoster = movie.imageUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';

    return `
      <div class="movie-card" id="fav-card-${movie._id}">
        <div class="poster-wrapper">
          <img src="${safePoster}" alt="${movie.title}" class="poster-img" onerror="this.src='https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80'" />
          <button class="card-fav-btn favorited" onclick="removeFavoriteFromProfile('${movie._id}')" title="Remove from Favorites">
            ♥
          </button>
        </div>
        <div class="movie-info">
          <h4 class="movie-title">${movie.title}</h4>
          <div class="movie-meta">
            <span>📅 ${movie.releaseYear}</span>
            <span>★ ${movie.rating}/10</span>
          </div>
          <button class="btn btn-secondary btn-sm" style="width: 100%; margin-top: auto;" onclick="openMovieDetailsModal('${movie._id}')">
            View
          </button>
        </div>
      </div>
    `;
  }).join('');
}

async function removeFavoriteFromProfile(movieId) {
  const user = getCurrentUser();
  if (!user) return;

  const res = await apiRequest(`/favorites/${movieId}`, 'DELETE', { userId: user._id });
  if (res.success) {
    showToast('Movie removed from favorites', 'info');
    const card = document.getElementById(`fav-card-${movieId}`);
    if (card) card.remove();
    // Reload favorites
    const favRes = await apiRequest(`/favorites/user/${user._id}`);
    renderUserFavorites(favRes.success ? favRes.favorites : []);
  }
}
