// Step 1: Axios impot korchi HTTP request pathabar jonno
import axios from "axios";

// API Key (.env file theke asbe ebar)
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Step 2: Ekta base axios instance toiri korchi jate bar bar baseURL ar key pass na korte hoy
const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
  // 404 ba onno errors e jate console e boro lal error na ase
  // Stop Axios from throwing on 404s to keep the catch block clean
  validateStatus: (status) => status < 500,
});

// Step 3: Bivinna rokomer data anar jonno functions toiri korchi

// 1. Trending
export const fetchTrending = async (
  type = "all",
  timeWindow = "day",
  page = 1,
) => {
  const { data } = await tmdbApi.get(`/trending/${type}/${timeWindow}`, {
    params: { page },
  });
  return data;
};

// 2. Popular (Movies ba TV Shows)
export const fetchPopular = async (type = "movie", page = 1) => {
  const { data } = await tmdbApi.get(`/${type}/popular`, { params: { page } });
  return data;
};

// 3. Search korar jonno (Search functionality parameter query receive korbe)
export const searchMulti = async (query, page = 1) => {
  const { data } = await tmdbApi.get(`/search/multi`, {
    params: { query, page },
  });
  return data;
};

// 4. Ekti nirdistho Movie ba TV Show er details anar jonno (aar tar video/trailer o)
export const fetchDetails = async (type = "movie", id) => {
  const response = await tmdbApi.get(`/${type}/${id}`, {
    params: { append_to_response: "videos,credits" },
  });

  // Jodi pawa na jay, tobe exception na diye null return korbo (for silent healing)
  if (response.status === 404) return null;
  return response.data;
};

export const fetchPeople = async (page = 1) => {
  const { data } = await tmdbApi.get(`/person/popular`, { params: { page } });
  return data;
};

// 5. Person details anar jonno
export const fetchPersonDetails = async (id) => {
  const { data } = await tmdbApi.get(`/person/${id}`);
  return data;
};

// 6. Person er movies/tv shows (combined credits) anar jonno
export const fetchPersonMovies = async (id) => {
  const { data } = await tmdbApi.get(`/person/${id}/combined_credits`);
  return data;
};

// Image er base path toiri korar jonno ekta helper function
export const getImageUrl = (path, size = "w500") => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
