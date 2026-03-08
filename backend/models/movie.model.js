// Step 1: Import mongoose
const mongoose = require("mongoose");

// Step 2: Define the Movie Schema
const movieSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    title: {
      type: String,
      required: false,
    },
    posterUrl: {
      type: String,
      required: false, // We'll handle missing posters on the frontend
    },
    description: {
      type: String,
      required: false,
    },
    releaseDate: {
      type: Date,
      required: false,
    },
    trailerLink: {
      // E.g., a YouTube URL
      type: String,
      required: false,
    },
    genre: {
      type: String,
      required: false,
    },
    category: {
      type: [String],
      required: false,
    },
    mediaType: {
      type: String,
      enum: ["movie", "tv"],
      default: "movie",
    },
    ratings: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
      },
    ],
  },
  {
    // Step 3: Add timestamps for createdAt and updatedAt
    timestamps: true,
  },
);

// Step 4: Create and export the Movie model
const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;
