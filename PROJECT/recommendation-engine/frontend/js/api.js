/**
 * Centralized API & Utility Module
 * Handles all REST API communications with the Node.js Express backend.
 */

// If frontend is served by Express, origin matches window.location.origin
// If frontend is opened via live-server or file, defaults to http://localhost:5000
const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? `${window.location.protocol}//${window.location.hostname}:${window.location.port || '8080'}/api`
  : '/api';

/**
 * Toast Notification Helper
 */
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '⚠️';

  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

/**
 * Auth Storage Helpers
 */
function getCurrentUser() {
  try {
    const raw = localStorage.getItem('recommendation_engine_user');
    if (!raw) return null;
    const user = JSON.parse(raw);
    if (user) {
      const effectiveId = user.id || user._id;
      user.id = effectiveId;
      user._id = effectiveId;
    }
    return user;
  } catch (e) {
    return null;
  }
}

function getCurrentUserId() {
  const u = getCurrentUser();
  return u ? (u.id || u._id) : null;
}

function setCurrentUser(user) {
  if (user) {
    const effectiveId = user.id || user._id;
    user.id = effectiveId;
    user._id = effectiveId;
    localStorage.setItem('recommendation_engine_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('recommendation_engine_user');
  }
}

function logout() {
  localStorage.removeItem('recommendation_engine_user');
  showToast('Logged out successfully', 'info');
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 500);
}

/**
 * Generic API Fetch Wrapper
 */
async function apiRequest(endpoint, method = 'GET', data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (data && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    options.body = JSON.stringify(data);
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const json = await res.json();

    // Universal ID normalization for seamless Java Spring Boot / MongoDB compatibility
    if (json) {
      if (json.user) {
        const uid = json.user.id || json.user._id;
        json.user.id = uid;
        json.user._id = uid;
      }
      if (json.movie) {
        const mid = json.movie.id || json.movie._id;
        json.movie.id = mid;
        json.movie._id = mid;
      }
      if (Array.isArray(json.movies)) {
        json.movies.forEach(m => {
          const mid = m.id || m._id;
          m.id = mid;
          m._id = mid;
        });
      }
      if (Array.isArray(json.recommendations)) {
        json.recommendations.forEach(r => {
          if (r.movie) {
            const mid = r.movie.id || r.movie._id;
            r.movie.id = mid;
            r.movie._id = mid;
          }
        });
      }
      if (Array.isArray(json.favorites)) {
        json.favorites.forEach(f => {
          if (f.movie) {
            const mid = f.movie.id || f.movie._id;
            f.movie.id = mid;
            f.movie._id = mid;
            f.movieId = mid;
          }
        });
      }
      if (Array.isArray(json.ratings)) {
        json.ratings.forEach(r => {
          if (r.movie) {
            const mid = r.movie.id || r.movie._id;
            r.movie.id = mid;
            r.movie._id = mid;
            r.movieId = mid;
          }
        });
      }
    }

    return json;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    return {
      success: false,
      message: 'Network error or backend is not running. Please check server.'
    };
  }
}

/**
 * Update Navigation Bar based on authentication state
 */
function updateNavbarAuth() {
  const authNav = document.getElementById('navbar-auth-section');
  if (!authNav) return;

  const user = getCurrentUser();
  if (user) {
    authNav.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <a href="profile.html" class="nav-link" style="display: flex; align-items: center; gap: 0.4rem;">
          <span style="display: inline-block; width: 28px; height: 28px; background: linear-gradient(135deg, #6366f1, #a855f7); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; color: #fff;">
            ${user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </span>
          <span style="font-weight: 600;">${user.name || 'Profile'}</span>
        </a>
        <button id="logout-btn" class="btn btn-secondary btn-sm" onclick="logout()">Logout</button>
      </div>
    `;
  } else {
    authNav.innerHTML = `
      <a href="login.html" class="btn btn-secondary btn-sm">Login</a>
      <a href="register.html" class="btn btn-primary btn-sm">Register</a>
    `;
  }
}

// Auto initialize navbar state on DOM load
document.addEventListener('DOMContentLoaded', () => {
  updateNavbarAuth();
});
