/**
 * useMovieDetail Hook (Orchestration Layer)
 * Ei hook ta Movie details fetch kora, merge kora, ar user interactions coordinate kore.
 * This hook coordinates movie data fetching, merging, and user interactions.
 */
import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { movieService } from "../services/movieService";
import { userService } from "../services/userService";
import { fetchDetails } from "../utils/tmdb";

export const useMovieDetail = (id) => {
  const location = useLocation();
  const { user, token, refreshUser } = useContext(AuthContext);

  // States to store data
  const [movie, setMovie] = useState(null);
  const [localMovie, setLocalMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  // User status states
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  /**
   * Data Coordination Logic
   * TMDB ar Local Backend er data eksathe merge korar main function.
   * Main function to merge data from TMDB and our Local Backend.
   */
  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Step 1: Local Backend check kora (Like User Ratings)
      // Check local database for extra data like ratings
      const localData = await movieService.getMovieDetails(id);
      setLocalMovie(localData);

      // Step 2: Determine if it's a TMDB ID or Local ID
      const isMongoId = !Number(id) && id.length > 20;
      const type = location.pathname.includes("/tv/") ? "tv" : "movie";

      let finalData = null;
      if (isMongoId && localData && !localData.tmdbId) {
        // Case A: Manual movie (Added by Admin)
        localData.media_type = "movie";
        finalData = localData;
      } else {
        // Case B: Fetch from TMDB and merge with local edits
        let tmdbData = await fetchDetails(type, id).catch(() => null);

        if (tmdbData || localData) {
          // Merge technique: Local data overrides TMDB data if available
          finalData = { ...(tmdbData || {}), ...(localData || {}) };

          if (localData) {
            if (localData.title?.trim()) finalData.title = localData.title;
            if (localData.posterUrl?.trim())
              finalData.posterUrl = localData.posterUrl;
            if (localData.description?.trim())
              finalData.overview = localData.description;
            if (localData.releaseDate)
              finalData.releaseDate = localData.releaseDate;
          }

          if (tmdbData) finalData.media_type = type;
          else if (localData) finalData.media_type = "movie";
        }
      }

      if (finalData) {
        setMovie(finalData); // Data ready for UI
      } else {
        throw new Error("Content not found");
      }

      // Step 3: Log to watch history (Silent operation)
      if (token && id) {
        userService
          .addToHistory(id, token, finalData.media_type)
          .then(() => refreshUser())
          .catch((err) => console.warn("History update failed", err));
      }
    } catch (error) {
      console.error("Error in useMovieDetail orchestration", error);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when ID changes
  useEffect(() => {
    if (id) fetchAllData();
  }, [id, token, location.pathname]);

  // Sync user context lists with local state
  useEffect(() => {
    if (user) {
      setIsFavorite(user.favorites?.includes(String(id)));
      setIsBookmarked(user.bookmarks?.includes(String(id)));
      setInWatchlist(user.watchlist?.includes(String(id)));
    }
  }, [user, id]);

  // Sync user's personal rating
  useEffect(() => {
    if (localMovie && user && localMovie.ratings) {
      const userRatingObj = localMovie.ratings.find(
        (r) => r.userId === user._id,
      );
      if (userRatingObj) setRating(userRatingObj.rating);
    }
  }, [localMovie, user]);

  /**
   * Interaction Handlers
   * UI components ei functions gulo call kore status change korar jonno.
   * Functions for UI to call for updating status.
   */
  const toggleFavorite = async () => {
    if (!token) return alert("Please log in to add to favorites");
    try {
      await userService.toggleFavorite(id, isFavorite, token, movie.media_type);
      setIsFavorite(!isFavorite);
      await refreshUser();
    } catch (error) {
      console.error("Error toggling favorite", error);
    }
  };

  const toggleBookmark = async () => {
    if (!token) return alert("Please log in to bookmark");
    try {
      await userService.toggleBookmark(id, token, movie.media_type);
      setIsBookmarked(!isBookmarked);
      await refreshUser();
    } catch (error) {
      console.error("Error toggling bookmark", error);
    }
  };

  const toggleWatchlist = async () => {
    if (!token) return alert("Please log in to add to watchlist");
    try {
      await userService.toggleWatchlist(id, token, movie.media_type);
      setInWatchlist(!inWatchlist);
      await refreshUser();
    } catch (error) {
      console.error("Error toggling watchlist", error);
    }
  };

  const submitRating = async (newRating) => {
    if (!token) return alert("Please log in to rate");
    try {
      await movieService.submitRating(id, newRating, movie.media_type, token);
      setRating(newRating);
      // Re-fetch local data to update average rating in UI
      const updatedLocal = await movieService.getMovieDetails(id);
      setLocalMovie(updatedLocal);
    } catch (error) {
      console.error("Error submitting rating", error);
    }
  };

  // Return values for UI Layer
  return {
    movie,
    localMovie,
    loading,
    isFavorite,
    isBookmarked,
    inWatchlist,
    rating,
    hoverRating,
    setHoverRating,
    toggleFavorite,
    toggleBookmark,
    toggleWatchlist,
    submitRating,
  };
};
