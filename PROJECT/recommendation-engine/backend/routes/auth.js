const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user with preferred genres
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword, preferredGenres } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Parse preferred genres (array of strings)
    const genres = Array.isArray(preferredGenres) ? preferredGenres : [];

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      preferredGenres: genres
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        preferredGenres: user.preferredGenres,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, message: 'Server error during registration.', error: err.message });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return user profile
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    return res.json({
      success: true,
      message: 'Login successful!',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        preferredGenres: user.preferredGenres,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login.', error: err.message });
  }
});

/**
 * @route   GET /api/auth/me/:userId
 * @desc    Get current user profile
 */
router.get('/me/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error retrieving user profile.', error: err.message });
  }
});

/**
 * @route   PUT /api/auth/preferences/:userId
 * @desc    Update user preferred genres
 */
router.put('/preferences/:userId', async (req, res) => {
  try {
    const { preferredGenres } = req.body;
    if (!Array.isArray(preferredGenres)) {
      return res.status(400).json({ success: false, message: 'preferredGenres must be an array of strings.' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { preferredGenres },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({
      success: true,
      message: 'Preferences updated successfully!',
      user
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error updating preferences.', error: err.message });
  }
});

module.exports = router;
