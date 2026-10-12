const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Movie = require('../models/Movie');
const Rating = require('../models/Rating');
const Favorite = require('../models/Favorite');
const { getPersonalizedRecommendations } = require('../algorithms/recommendationEngine');

/**
 * @route   GET /api/recommendations/:userId
 * @desc    Generate personalized movie recommendations using DSA MaxHeap Priority Queue
 */
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit, 10) || 12;

    // 1. Fetch user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // 2. Fetch all available movies
    const allMovies = await Movie.find().lean();
    if (!allMovies || allMovies.length === 0) {
      return res.status(200).json({
        success: true,
        recommendations: [],
        message: 'No movies available in database. Please run the seed script.'
      });
    }

    // 3. Fetch user historical ratings with populated movie data
    const userRatings = await Rating.find({ userId }).populate('movieId').lean();

    // 4. Fetch user favorites
    const userFavorites = await Favorite.find({ userId }).populate('movieId').lean();

    // 5. Execute DSA Recommendation Engine
    const { recommendations, dsaStats } = getPersonalizedRecommendations({
      user,
      allMovies,
      userRatings,
      userFavorites,
      limit
    });

    return res.json({
      success: true,
      userId: user._id,
      userName: user.name,
      preferredGenres: user.preferredGenres,
      count: recommendations.length,
      recommendations,
      dsaStats
    });
  } catch (err) {
    console.error('Recommendation generation error:', err);
    return res.status(500).json({
      success: false,
      message: 'Error computing recommendations.',
      error: err.message
    });
  }
});

module.exports = router;
