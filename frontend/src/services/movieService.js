/**
 * Movie Service (API Layer)
 * Movie related sob backend calls eikhan theke hoy.
 * All movie-related backend calls are managed here.
 */
import api from "./api";

export const movieService = {
  // Local database theke movie details anar jonno
  // Fetch movie details from our local database using movie ID
  getMovieDetails: async (id) => {
    try {
      const { data } = await api.get(`/api/movies/${id}`);
      return data;
    } catch (error) {
      return null;
    }
  },

  // Rating submit kora (Local backend e)
  submitRating: async (id, rating, mediaType, token) => {
    return api.post(
      `/api/movies/${id}/rate`,
      { rating, mediaType },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  },

  // Searching logic for local database
  // Search for movies in our local database using a keyword
  searchLocalMovies: (keyword) => {
    return api.get(`/api/movies?keyword=${keyword}`);
  },
};
