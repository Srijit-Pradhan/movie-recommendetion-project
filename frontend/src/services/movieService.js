/**
 * Movie Service (API Layer)
 * Movie related sob backend calls eikhan theke hoy.
 * All movie-related backend calls are managed here.
 */
import api from "./api";
import axios from "axios";
const API_URL = "http://localhost:3000/api/movies";

export const movieService = {
  // Local database theke movie details anar jonno
  // Fetch movie details from our local database using movie ID
  getMovieDetails: async (id) => {
    try {
      const { data } = await api.get(`/movies/${id}`);
      return data;
    } catch (error) {
      return null;
    }
  },

  // Rating submit kora (Local backend e)
  submitRating: async (id, rating, mediaType, token) => {
    return axios.post(
      `${API_URL}/${id}/rate`,
      { rating, mediaType },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  },

  // Searching logic for local database
  // Search for movies in our local database using a keyword
  searchLocalMovies: (keyword) => {
    return api.get(`/movies?keyword=${keyword}`);
  },
};
