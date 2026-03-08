// Step 1: Express ar router import kora
const express = require("express");
const router = express.Router();

// Step 2: Movie er jonno banano controller function gulo import korchi
const {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  rateMovie,
  syncMediaType,
} = require("../controllers/movie.controller"); // Changed to movie.controller

// Step 3: Security ba Auth middleware gulo import korchi
const { protect, admin } = require("../middleware/auth.middleware"); // Changed to auth.middleware

// Step 4: Route (Endpoints) define kora
// GET '/' -> Shob movie pabe (Sobai pabe)
// POST '/' -> Notun movie add korbe (Shudhu Admin parbe karon protect, admin pass kora ache)
router.route("/").get(getMovies).post(protect, admin, createMovie);

// Specific ID dhore kaj kora:
// GET -> sei ID r movie dekhabe
// PUT -> update korbe (Admin only)
// DELETE -> delete korbe (Admin only)
router
  .route("/:id")
  .get(getMovieById)
  .put(protect, admin, updateMovie)
  .delete(protect, admin, deleteMovie);

// Rating dewar endpoint (Logged in user jekeu parbe, tai shudhu 'protect' dilam)
router.route("/:id/rate").post(protect, rateMovie);

// Public sync route to heal 404s without needing a token
router.route("/:id/sync-type").post(syncMediaType);

// Step 5: Export router jate main server app e connect kora jay
module.exports = router;
