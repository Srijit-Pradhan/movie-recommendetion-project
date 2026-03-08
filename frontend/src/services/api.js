/**
 * Step 1: Axios instance setup (API Layer)
 * Axios holo ekta library jeta diye backend server er sathe kotha bola jay (HTTP requests).
 * Axios is a library used to communicate with the backend server via HTTP requests.
 */
import axios from "axios";

// Ekta base instance banachhi jate bar bar pure URL likhte na hoy
// Creating a base instance to avoid repeating the base URL in every request
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

/**
 * Step 2: Interceptor (Request Security)
 * Interceptor use kore proti ta request pathanor aage amra login token ta add kore dei.
 * Interceptors allow us to attach the login token to every request automatically for security.
 */
api.interceptors.request.use(
  (config) => {
    // Local storage theke token ta jodi thake tahole niye nei
    // Get the token from local storage if it exists
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
