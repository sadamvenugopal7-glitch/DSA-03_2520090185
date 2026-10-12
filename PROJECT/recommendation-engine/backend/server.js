const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');

// Load environment configuration
dotenv.config({ path: path.join(__dirname, '../.env') });
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.join(__dirname, '.env') });
}

// Routes
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const ratingRoutes = require('./routes/ratings');
const favoriteRoutes = require('./routes/favorites');
const recommendationRoutes = require('./routes/recommendations');

// Seed helper
const Movie = require('./models/Movie');
const { seedDatabase } = require('./seed/seedData');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/recommendation_engine';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve Frontend Static Files
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    dsaEngine: 'ready'
  });
});

// REST API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Fallback to frontend index for non-API routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API route not found' });
  }
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

// MongoDB Connection & Server Startup
async function startServer() {
  try {
    console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB successfully connected.');

    // Auto-seed if database is empty
    const movieCount = await Movie.countDocuments();
    if (movieCount === 0) {
      console.log('Catalog is empty. Automatically seeding initial sample movies and demo user...');
      await seedDatabase();
    } else {
      console.log(`Found ${movieCount} movies in database catalog.`);
    }

    app.listen(PORT, () => {
      console.log('====================================================');
      console.log(`🚀 CineMatch Recommendation Engine running on port: ${PORT}`);
      console.log(`🌐 Local Webpage URL: http://localhost:${PORT}`);
      console.log(`📡 API Base URL:      http://localhost:${PORT}/api`);
      console.log('====================================================');
    });
  } catch (err) {
    console.error('Fatal Database Connection Error:', err.message);
    console.error('Please ensure MongoDB is running locally on port 27017 or provide MONGODB_URI in .env');
    process.exit(1);
  }
}

startServer();
