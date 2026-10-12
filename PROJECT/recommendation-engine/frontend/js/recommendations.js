/**
 * Recommendations Page Controller
 * Fetches and displays ranked movies computed by the backend MaxHeap Priority Queue.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const user = requireAuth();
  if (!user) return;

  await loadRecommendations(user);
});

async function loadRecommendations(user) {
  const container = document.getElementById('recommendations-container');
  const dsaStatsContainer = document.getElementById('dsa-stats-container');
  if (!container) return;

  container.innerHTML = `
    <div style="text-align: center; padding: 4rem; color: var(--text-muted);">
      <div style="font-size: 2rem; margin-bottom: 1rem;">⚙️</div>
      <h3 style="color: var(--text-main); margin-bottom: 0.5rem;">Executing CineMatch Recommendation Engine...</h3>
      <p>Building Max-Heap Priority Queue & calculating multi-factor affinity scores</p>
    </div>
  `;

  const res = await apiRequest(`/recommendations/${user._id}?limit=15`);

  if (!res.success || !Array.isArray(res.recommendations) || res.recommendations.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 4rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
        <h3>No recommendations available right now</h3>
        <p style="color: var(--text-muted); margin: 1rem 0;">Rate more movies or update your preferred genres to receive personalized recommendations!</p>
        <a href="movies.html" class="btn btn-primary">Browse Movie Catalog</a>
      </div>
    `;
    return;
  }

  // Render DSA Stats Widget
  if (dsaStatsContainer && res.dsaStats) {
    dsaStatsContainer.innerHTML = `
      <div class="dsa-stats-bar">
        <div class="dsa-metric">
          <span class="dsa-metric-val">${res.dsaStats.heapSizeAtPeak}</span>
          <span class="dsa-metric-label">Heap Candidates</span>
        </div>
        <div class="dsa-metric">
          <span class="dsa-metric-val">${res.dsaStats.topKExtracted}</span>
          <span class="dsa-metric-label">Heap Extractions (Top-K)</span>
        </div>
        <div class="dsa-metric">
          <span class="dsa-metric-val">${res.dsaStats.userRatingsCount}</span>
          <span class="dsa-metric-label">Rating History Points</span>
        </div>
        <div class="dsa-metric">
          <span class="dsa-metric-val">${res.dsaStats.executionTimeMs} ms</span>
          <span class="dsa-metric-label">Computation Time</span>
        </div>
        <div style="flex-basis: 100%; font-size: 0.82rem; color: #a5b4fc; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 0.6rem; display: flex; align-items: center; gap: 0.4rem;">
          <span>💡 <strong>Viva Note:</strong> ${res.dsaStats.complexityExplanation}</span>
        </div>
      </div>
    `;
  }

  // Render Ranked Recommendations
  container.innerHTML = res.recommendations.map(item => {
    const movie = item.movie;
    const score = item.recommendationScore;
    const safePoster = movie.imageUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
    const genresHtml = (movie.genres || []).map(g => `<span class="genre-tag">${g}</span>`).join('');

    return `
      <div class="rec-rank-card">
        <div class="rec-rank-indicator">
          <span class="rank-number">#${item.rank}</span>
          <span class="rank-label">Rank</span>
        </div>
        <img src="${safePoster}" alt="${movie.title}" class="rec-poster" onerror="this.src='https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80'" />
        <div class="rec-content">
          <div>
            <div class="rec-header">
              <div class="rec-title-block">
                <h3>${movie.title}</h3>
                <div style="font-size: 0.85rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.75rem; margin-top: 0.2rem;">
                  <span>📅 ${movie.releaseYear}</span>
                  <span>★ ${movie.rating}/10 Global</span>
                </div>
              </div>
              <div class="rec-score-meter">
                <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: #cbd5e1;">Score</span>
                <span class="rec-score-val">${score} / 10</span>
              </div>
            </div>

            <div class="genre-tags" style="margin-top: 0.75rem;">
              ${genresHtml}
            </div>

            <div class="why-recommended-box">
              <div class="why-label">Why Recommended:</div>
              <div class="why-text">${item.whyRecommended}</div>
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem; align-items: center; margin-top: 0.75rem; flex-wrap: wrap;">
            <button class="btn btn-primary btn-sm" onclick="openMovieDetailsModal('${movie._id}')">
              View & Rate
            </button>
            <button class="btn btn-secondary btn-sm" onclick="toggleFavorite(event, '${movie._id}')">
              ♥ Save to Favorites
            </button>
            <div style="margin-left: auto; font-size: 0.8rem; color: var(--text-dim);">
              Genre Match: ${item.scoreBreakdown?.genreMatchScore || 0}/10 | Sim: ${item.scoreBreakdown?.similarityScore || 0}/10
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}
