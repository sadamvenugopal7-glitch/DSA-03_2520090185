const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

/**
 * @route   GET /api/movies/search
 * @desc    Search movies by title, description, or genre (case-insensitive)
 */
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim() === '') {
      const allMovies = await Movie.find().sort({ rating: -1 });
      return res.json({ success: true, count: allMovies.length, movies: allMovies });
    }

    const cleanQuery = query.trim();
    const regex = new RegExp(cleanQuery, 'i');

    const matchedMovies = await Movie.find({
      $or: [
        { title: regex },
        { genres: regex },
        { description: regex }
      ]
    }).sort({ rating: -1 });

    return res.json({
      success: true,
      query: cleanQuery,
      count: matchedMovies.length,
      movies: matchedMovies
    });
  } catch (err) {
    console.error('Search error:', err);
    return res.status(500).json({ success: false, message: 'Error searching movies.', error: err.message });
  }
});

/**
 * @route   GET /api/movies/genre/:genre
 * @desc    Get movies by specific genre
 */
router.get('/genre/:genre', async (req, res) => {
  try {
    const { genre } = req.params;
    const regex = new RegExp(`^${genre.trim()}$`, 'i');
    const movies = await Movie.find({ genres: regex }).sort({ rating: -1 });

    return res.json({
      success: true,
      genre,
      count: movies.length,
      movies
    });
  } catch (err) {
    console.error('Genre filter error:', err);
    return res.status(500).json({ success: false, message: 'Error filtering by genre.', error: err.message });
  }
});

/**
 * @route   GET /api/movies
 * @desc    Get all movies with sorting and optional filtering
 */
router.get('/', async (req, res) => {
  try {
    const { sortBy = 'rating', order = 'desc', genre } = req.query;

    const filter = {};
    if (genre && genre !== 'All') {
      filter.genres = new RegExp(`^${genre.trim()}$`, 'i');
    }

    const sortOption = {};
    const sortField = ['rating', 'releaseYear', 'title'].includes(sortBy) ? sortBy : 'rating';
    sortOption[sortField] = order === 'asc' ? 1 : -1;

    const movies = await Movie.find(filter).sort(sortOption);

    return res.json({
      success: true,
      count: movies.length,
      movies
    });
  } catch (err) {
    console.error('Fetch movies error:', err);
    return res.status(500).json({ success: false, message: 'Error retrieving movies.', error: err.message });
  }
});

/**
 * @route   GET /api/movies/:id
 * @desc    Get single movie by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found.' });
    }
    return res.json({ success: true, movie });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error retrieving movie details.', error: err.message });
  }
});

module.exports = router;
