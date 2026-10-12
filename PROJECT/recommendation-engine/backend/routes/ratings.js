const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const Movie = require('../models/Movie');

/**
 * @route   POST /api/ratings
 * @desc    Submit or update movie rating by user (1 to 5)
 */
router.post('/', async (req, res) => {
  try {
    const { userId, movieId, rating } = req.body;

    if (!userId || !movieId || rating === undefined) {
      return res.status(400).json({ success: false, message: 'userId, movieId, and rating are required.' });
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be an integer between 1 and 5.' });
    }

    // Verify movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found.' });
    }

    // Upsert rating (create if new, update if already rated)
    const updatedRating = await Rating.findOneAndUpdate(
      { userId, movieId },
      { rating: numericRating, createdAt: new Date() },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Rating saved successfully!',
      rating: updatedRating
    });
  } catch (err) {
    console.error('Rating save error:', err);
    return res.status(500).json({ success: false, message: 'Failed to record rating.', error: err.message });
  }
});

/**
 * @route   GET /api/ratings/user/:userId
 * @desc    Get all ratings submitted by a specific user
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const ratings = await Rating.find({ userId: req.params.userId })
      .populate('movieId')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: ratings.length,
      ratings
    });
  } catch (err) {
    console.error('Fetch user ratings error:', err);
    return res.status(500).json({ success: false, message: 'Error retrieving user ratings.', error: err.message });
  }
});

/**
 * @route   GET /api/ratings/movie/:movieId
 * @desc    Get aggregate rating stats for a movie
 */
router.get('/movie/:movieId', async (req, res) => {
  try {
    const ratings = await Rating.find({ movieId: req.params.movieId });
    const count = ratings.length;
    const average = count > 0 
      ? Number((ratings.reduce((acc, curr) => acc + curr.rating, 0) / count).toFixed(1)) 
      : 0;

    return res.json({
      success: true,
      movieId: req.params.movieId,
      count,
      averageRating: average
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error calculating movie rating stats.', error: err.message });
  }
});

module.exports = router;
