const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Movie description is required'],
      trim: true
    },
    genres: {
      type: [String],
      required: [true, 'At least one genre is required'],
      index: true
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
      default: 7.0
    },
    releaseYear: {
      type: Number,
      required: [true, 'Release year is required'],
      min: 1900,
      max: 2030
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL / Poster is required'],
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Text index for fast searching on title and description
movieSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Movie', movieSchema);
