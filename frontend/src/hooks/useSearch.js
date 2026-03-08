/**
 * useSearch Hook (Orchestration Layer)
 * Search page er logic coordinate korar jonno ei hook.
 * This hook coordinates search logic for the search page.
 */
import { useState, useEffect } from "react";
import { movieService } from "../services/movieService";
import { searchMulti } from "../utils/tmdb";
import { useDebounce } from "./useDebounce";

export const useSearch = (initialQuery = "") => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debouncing setup: User likhte thakle bar bar call na kore ektu wait korbe
  // Debouncing stops the API from being hammered while the user is typing
  const debouncedQuery = useDebounce(query, 500);

  /**
   * Search Coordination Logic
   * Local Database ar TMDB theke data niye deduplicate kore result ready kore.
   * Fetches data from both sources and deduplicates based on title.
   */
  const fetchSearchResults = async () => {
    // Jodi search box khali thake tahole result reset kore dao
    if (debouncedQuery.trim() === "") {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      // Step 1: Parallel calls to Local Backend and TMDB
      const [{ data: localResponse }, tmdbData] = await Promise.all([
        movieService.searchLocalMovies(debouncedQuery),
        searchMulti(debouncedQuery),
      ]);

      const localResults = localResponse?.movies || [];

      // Step 2: Deduplicate (Local results take priority)
      const filteredTmdbResults = (tmdbData.results || []).filter((item) => {
        // Person items kete dao jader chobi nei
        if (item.media_type === "person" && !item.profile_path) return false;

        const title = item.title || item.name;
        // Jodi same title er movie amader local db te thake, tobe tmdb version ta nibo na
        return !localResults.some(
          (local) =>
            (local.title || "").toLowerCase() === (title || "").toLowerCase(),
        );
      });

      // Combine both lists
      setResults([...localResults, ...filteredTmdbResults]);
    } catch (error) {
      console.error("Search error in useSearch orchestration", error);
    } finally {
      setLoading(false);
    }
  };

  // Run search when debounced query changes
  useEffect(() => {
    fetchSearchResults();
  }, [debouncedQuery]);

  return {
    query,
    setQuery,
    results,
    loading,
    debouncedQuery,
  };
};
