// Step 1: Model gulo import kora
const User = require("../models/user.model");
const Movie = require("../models/movie.model");

// Step 2: User profile ar tar shob data dewar function
// GET /api/users/profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isBanned: user.isBanned,
        favorites: user.favorites,
        watchHistory: user.watchHistory,
        bookmarks: user.bookmarks,
        watchlist: user.watchlist,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Step 3: Favorite array te movie add kora
// POST /api/users/favorites
const addFavorite = async (req, res) => {
  try {
    const { movieId, mediaType } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
      if (!user.favorites.includes(movieId)) {
        user.favorites.push(movieId);
        await user.save();

        // Ensure Movie record exists with correct mediaType
        let movieRecord = await Movie.findById(movieId);
        if (!movieRecord) {
          await Movie.create({ _id: movieId, mediaType: mediaType || "movie" });
        } else if (mediaType && !movieRecord.mediaType) {
          movieRecord.mediaType = mediaType;
          await movieRecord.save();
        }
      }
      res
        .status(200)
        .json({ message: "Added to favorites", favorites: user.favorites });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Step 4: Favorite theke movie remove kora
// DELETE /api/users/favorites/:movieId
const removeFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.favorites = user.favorites.filter(
        (id) => id && id.toString() !== req.params.movieId,
      );
      await user.save();
      res
        .status(200)
        .json({ message: "Removed from favorites", favorites: user.favorites });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Step 5: Watch history add kora
// POST /api/users/history
const addWatchHistory = async (req, res) => {
  try {
    const { movieId, mediaType } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
      // Remove duplication and unshift to top
      user.watchHistory = user.watchHistory.filter(
        (id) => id && id.toString() !== movieId,
      );
      user.watchHistory.unshift(movieId);
      if (user.watchHistory.length > 50) user.watchHistory.pop();

      try {
        await user.save();

        // Sync mediaType
        let movieRecord = await Movie.findById(movieId);
        if (!movieRecord) {
          await Movie.create({ _id: movieId, mediaType: mediaType || "movie" });
        } else if (mediaType && !movieRecord.mediaType) {
          movieRecord.mediaType = mediaType;
          await movieRecord.save();
        }

        res
          .status(200)
          .json({
            message: "Added to watch history",
            watchHistory: user.watchHistory,
          });
      } catch (saveError) {
        if (saveError.name === "VersionError") {
          return res
            .status(200)
            .json({
              message: "Bypassed concurrent save",
              watchHistory: user.watchHistory,
            });
        }
        throw saveError;
      }
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Step 6: Get all users (Admin only)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Step 7: Delete user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await User.deleteOne({ _id: user._id });
      res.json({ message: "User removed" });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Step 8: Toggle Bookmark
const toggleBookmark = async (req, res) => {
  try {
    const { movieId, mediaType } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
      const isBookmarked = user.bookmarks.includes(movieId);
      if (isBookmarked) {
        user.bookmarks = user.bookmarks.filter(
          (id) => id && id.toString() !== movieId,
        );
      } else {
        user.bookmarks.push(movieId);
      }
      await user.save();

      if (!isBookmarked) {
        let movieRecord = await Movie.findById(movieId);
        if (!movieRecord) {
          await Movie.create({ _id: movieId, mediaType: mediaType || "movie" });
        } else if (mediaType && !movieRecord.mediaType) {
          movieRecord.mediaType = mediaType;
          await movieRecord.save();
        }
      }

      res
        .status(200)
        .json({
          message: isBookmarked ? "Removed" : "Added",
          bookmarks: user.bookmarks,
        });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Step 9: Toggle Watchlist
const toggleWatchlist = async (req, res) => {
  try {
    const { movieId, mediaType } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
      const inWatchlist = user.watchlist.includes(movieId);
      if (inWatchlist) {
        user.watchlist = user.watchlist.filter(
          (id) => id && id.toString() !== movieId,
        );
      } else {
        user.watchlist.push(movieId);
      }
      await user.save();

      if (!inWatchlist) {
        let movieRecord = await Movie.findById(movieId);
        if (!movieRecord) {
          await Movie.create({ _id: movieId, mediaType: mediaType || "movie" });
        } else if (mediaType && !movieRecord.mediaType) {
          movieRecord.mediaType = mediaType;
          await movieRecord.save();
        }
      }

      res
        .status(200)
        .json({
          message: inWatchlist ? "Removed" : "Added",
          watchlist: user.watchlist,
        });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Step 10: Ban a User (Admin)
const banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.isBanned = !user.isBanned;
      await user.save();
      res.json({
        message: user.isBanned ? "Banned" : "Unbanned",
        isBanned: user.isBanned,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  addFavorite,
  removeFavorite,
  addWatchHistory,
  getUsers,
  deleteUser,
  toggleBookmark,
  toggleWatchlist,
  banUser,
};
