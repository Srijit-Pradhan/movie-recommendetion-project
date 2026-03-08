/**
 * Search Page (UI/Presentation Layer)
 * Search UI handle korar jonno ei component.
 * This component is responsible for the search UI.
 */
import React from "react";
import { Search as SearchIcon } from "lucide-react";
import MovieCard from "../components/MovieCard";
import Loader from "../components/Loader";
// Hook layer/Orchestration import korchi
import { useSearch } from "../hooks/useSearch";
import "./Search.css";

const Search = () => {
  /**
   * Step 1: Hook call
   * Search logic (TMDB + Local DB) sob logic hooks e alada kora hoyeche.
   * All search logic is handled by the useSearch hook.
   */
  const { query, setQuery, results, loading, debouncedQuery } = useSearch("");

  return (
    <div className="search-page">
      {/* Search Bar Section */}
      <div className="search-header">
        <SearchIcon className="search-icon" size={24} />
        <input
          type="text"
          className="search-input"
          placeholder="Search for movies, TV shows by title..."
          value={query}
          // Input change hole setQuery diye hook er state update korchi
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {/* Results Grid Section */}
      {loading ? (
        <Loader /> // API call cholakalin loader dekhabo
      ) : (
        <div className="movies-grid">
          {results.length > 0
            ? // Results array take map kore MovieCard components banachhi
              results.map((movie) => (
                <MovieCard key={movie.id || movie._id} movie={movie} />
              ))
            : // Result na thakle message dekhabo
              debouncedQuery && (
                <div className="no-results">
                  No results found for "{debouncedQuery}"
                </div>
              )}
        </div>
      )}
    </div>
  );
};

export default Search;
