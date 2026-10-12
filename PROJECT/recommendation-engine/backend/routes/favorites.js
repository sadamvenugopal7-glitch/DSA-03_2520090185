const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const Movie = require('../models/Movie');

/**
 * @route   POST /api/favorites
 * @desc    Add a movie to user's favorites
 */
router.post('/', async (req, res) => {
  try {
    const { userId, movieId } = req.body;

    if (!userId || !movieId) {
      return res.status(400).json({ success: false, message: 'Both userId and movieId are required.' });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found.' });
    }

    // Check if already in favorites
    const existing = await Favorite.findOne({ userId, movieId });
    if (existing) {
      return res.status(200).json({ success: true, message: 'Movie is already in favorites.', favorite: existing });
    }

    const newFavorite = await Favorite.create({ userId, movieId });

    return res.status(201).json({
      success: true,
      message: 'Movie added to favorites!',
      favorite: newFavorite
    });
  } catch (err) {
    console.error('Add favorite error:', err);
    return res.status(500).json({ success: false, message: 'Error adding favorite.', error: err.message });
  }
});

/**
 * @route   GET /api/favorites/user/:userId
 * @desc    Get all favorites for a user with populated movie details
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.params.userId })
      .populate('movieId')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: favorites.length,
      favorites
    });
  } catch (err) {
    console.error('Fetch favorites error:', err);
    return res.status(500).json({ success: false, message: 'Error fetching favorites.', error: err.message });
  }
});

/**
 * @route   DELETE /api/favorites/:movieId
 * @desc    Remove a movie from user's favorites
 */
router.delete('/:movieId', async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.body.userId || req.query.userId;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId is required (in query or body).' });
    }

    const deleted = await Favorite.findOneAndDelete({ userId, movieId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Favorite not found for this user.' });
    }

    return res.json({
      success: true,
      message: 'Movie removed from favorites.'
    });
  } catch (err) {
    console.error('Delete favorite error:', err);
    return res.status(500).json({ success: false, message: 'Error removing favorite.', error: err.message });
  }
});

module.exports = router;
