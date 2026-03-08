// Step 1: Hooks o components nilam
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import api from "../services/api";
import MovieCard from "../components/MovieCard";
import Loader from "../components/Loader";
import {
  fetchTrending,
  fetchPopular,
  fetchPeople,
  searchMulti,
  getImageUrl,
} from "../utils/tmdb"; // Nothun tmdb service
import "./Home.css";

const Home = () => {
  // Step 2: Bivinna section er jonno alada alada state banalam
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search ba filter er state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Step 3: Page load holei ek shathe shob section er data anbo TMDB theke
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Promise.all use korle shob API call eksathe parallel e hobe, somoy bachbe
        const [trendingData, popularData, moviesData, tvShowsData, peopleData] =
          await Promise.all([
            fetchTrending("all", "day"),
            fetchPopular("movie"),
            fetchTrending("movie", "week"), // Just as a 'movies' section variant
            fetchTrending("tv", "week"), // Just as a 'tv' section variant
            fetchPeople(),
          ]);

        setTrending(trendingData.results.slice(0, 10)); // Top 10 nechi section e dekhanor jonno
        setPopular(popularData.results.slice(0, 10));
        setMovies(moviesData.results.slice(0, 10));
        setTvShows(tvShowsData.results.slice(0, 10));
        setPeople(peopleData.results.slice(0, 10));
      } catch (error) {
        console.error("Error fetching TMDB data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Step 4: Debounce Search er logic
  // User jokhon type korbe, protibar na theme thakle api call hobena.
  useEffect(() => {
    // Jodi search box faka thake, search results clear korbo
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    // setTimeout diye 500ms(half second) wait korchi. Jodi user ei somoyer moddhe abar kichu type kore, purono timer cancel hoye jabe
    const delayDebounceFn = setTimeout(async () => {
      try {
        // Parallel call to both local and TMDB
        const [localResponse, tmdbData] = await Promise.all([
          api.get(`/api/movies?keyword=${searchQuery}`),
          searchMulti(searchQuery),
        ]);

        const localResults = localResponse.data.movies || [];
        // DEDUPLICATION: Remove TMDB results that already exist locally by title
        const filteredTmdbResults = (tmdbData.results || []).filter((item) => {
          if (item.media_type === "person" && !item.profile_path) return false;
          const title = item.title || item.name;
          return !localResults.some(
            (local) =>
              (local.title || "").toLowerCase() === (title || "").toLowerCase(),
          );
        });

        setSearchResults([...localResults, ...filteredTmdbResults]);
      } catch (error) {
        console.error("Search error", error);
      } finally {
        setIsSearching(false);
      }
    }, 500); // 500 ms = Debounce timer

    // Cleanup function: notun typing hole purono timer clear kore (idiomatically debouncing boles eke)
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  if (loading) return <Loader />;

  // UI Structure
  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <h1>Explore Unlimited Content</h1>
        <p>
          Discover the latest trending movies, popular TV shows, and amazing
          people.
        </p>

        {/* Step 5: Search Input jeta debounce er sathe kaj kore */}
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <input
            type="text"
            placeholder="Search for movies or TV shows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field hero-search-input"
          />
        </div>
      </div>

      {/* Step 6: Search korle shudhu search results dekhabo, noile section gulo */}
      {searchQuery.trim() !== "" ? (
        <div className="search-results-section" style={{ padding: "20px" }}>
          <h2>Search Results for "{searchQuery}"</h2>
          {isSearching ? (
            <Loader />
          ) : (
            <div className="movies-grid">
              {searchResults.length > 0 ? (
                searchResults.map((item) => (
                  <MovieCard key={item.id || item._id} movie={item} />
                ))
              ) : (
                <p>No results found.</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Section: Trending */}
          <section className="category-section" style={{ padding: "20px" }}>
            <h2>Trending Now</h2>
            <div className="movies-grid">
              {trending.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>

          {/* Section: Popular */}
          <section className="category-section" style={{ padding: "20px" }}>
            <h2>Popular Right Now</h2>
            <div className="movies-grid">
              {popular.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>

          {/* Section: Movies */}
          <section className="category-section" style={{ padding: "20px" }}>
            <h2>Top Movies</h2>
            <div className="movies-grid">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>

          {/* Section: TV Shows */}
          <section className="category-section" style={{ padding: "20px" }}>
            <h2>Hit TV Shows</h2>
            <div className="movies-grid">
              {tvShows.map((show) => (
                <MovieCard key={show.id} movie={show} />
              ))}
            </div>
          </section>

          {/* Section: People (Not using MovieCard directly because it's for people) */}
          <section className="category-section" style={{ padding: "20px" }}>
            <h2>Trending People</h2>
            <div className="movies-grid">
              {people.map((person) => (
                <Link
                  to={`/person/${person.id}`}
                  key={person.id}
                  className="movie-card"
                  style={{ textDecoration: "none" }}
                >
                  <div className="movie-poster-container">
                    <img
                      src={getImageUrl(person.profile_path)}
                      alt={person.name}
                      className="movie-poster"
                      onError={(e) => {
                        e.target.src =
                          "https://dummyimage.com/500x750/1e293b/ffffff&text=No+Image";
                      }}
                    />
                  </div>
                  <div className="movie-info">
                    <h3 className="movie-title">{person.name}</h3>
                    <div className="movie-category">
                      {person.known_for_department}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Home;
