/**
 * User Service (API Layer)
 * User related (history, favorites, etc.) sob backend calls eikhan theke hoy.
 * All user-related backend calls like favorites and history are managed here.
 */
import api from "./api";

export const userService = {
  // User er watch history te movie add korar jonno
  // Add a movie to the user's watch history
  addToHistory: (movieId, token, mediaType) => {
    return api.post(
      "/users/history",
      { movieId: String(movieId), mediaType },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    );
  },

  // Favorite list e add ba remove korar jonno
  // Toggle a movie in or out of the user's favorites list
  toggleFavorite: async (id, isFavorite, token, mediaType) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    if (isFavorite) {
      // Jodi aage theke thake tahole delete korbo
      return api.delete(`/users/favorites/${id}`, { headers });
    } else {
      // Na thakle add korbo
      return api.post(
        "/users/favorites",
        { movieId: String(id), mediaType },
        { headers },
      );
    }
  },

  // Bookmark toggle korar jonno
  // Toggle bookmark status for a movie
  toggleBookmark: (id, token, mediaType) => {
    return api.post(
      "/users/bookmarks",
      { movieId: String(id), mediaType },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    );
  },

  // Watchlist toggle korar jonno
  // Toggle watchlist status for a movie
  toggleWatchlist: (id, token, mediaType) => {
    return api.post(
      "/users/watchlist",
      { movieId: String(id), mediaType },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    );
  },
};
