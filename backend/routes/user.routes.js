// Step 1: Express and Router setup
const express = require("express");
const router = express.Router();

// Step 2: User controller theke function gulo asche
const {
  getUserProfile,
  addFavorite,
  removeFavorite,
  addWatchHistory,
  getUsers,
  deleteUser,
  toggleBookmark,
  toggleWatchlist,
  banUser,
} = require("../controllers/user.controller"); // Changed to user.controller

// Step 3: Security Middleware gulo nilam
const { protect, admin } = require("../middleware/auth.middleware"); // Changed to auth.middleware

// Step 4: Route configuration (kon URL e kon function cholbe)
// GET '/' -> Shob user ke dekhabe (Shudhu Admin)
router.route("/").get(protect, admin, getUsers);

// User Profile pawar jonno (Logged in thakte hobe)
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile);

// Favorite er jonno routes (Add/Delete)
router.route("/favorites").post(protect, addFavorite);
router.route("/favorites/:movieId").delete(protect, removeFavorite);

// History te add korar route
router.route("/history").post(protect, addWatchHistory);

// Bookmarks handle kora
router.route("/bookmarks").post(protect, toggleBookmark);

// Watchlist handle kora
router.route("/watchlist").post(protect, toggleWatchlist);

// Admin er kaj: user ke delete ba ban kora
router.route("/:id").delete(protect, admin, deleteUser);
router.route("/:id/ban").put(protect, admin, banUser);

// Step 5: Router ke onno file e use korar jonno pathiye dilam
module.exports = router;
