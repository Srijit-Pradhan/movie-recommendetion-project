import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import api from "../services/api";
import { fetchDetails, getImageUrl } from "../utils/tmdb";
import "./MovieCard.css"; // Amra existing movie card er styling use korbo

// Component ta sudhumatro TMDB id receive kore, fetch kore ar dekhay
const TMDBProfileCard = ({ id }) => {
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Client-side fetching logic with multi-level persistent healing
  useEffect(() => {
    let isMounted = true;
    const loadItem = async () => {
      try {
        setLoading(true);

        // A. Caching check: localStorage theke prothome dekhi (Instant)
        const cachedType = localStorage.getItem(`tmdb_type_${id}`);

        // B. Local backend theke check kora
        let localData = null;
        try {
          const { data } = await api.get(`/api/movies/${id}`);
          localData = data;
        } catch (err) {
          /* silent fail */
        }

        // C. Merge cached info
        const storedType = cachedType || localData?.mediaType;

        // D. Decide if we need TMDB
        const isMongoId = id && String(id).length > 20;
        const needsTmdb = !isMongoId || (localData && localData.tmdbId);

        let tmdbData = null;
        let finalType = storedType || "movie";

        if (needsTmdb) {
          const lookupId = localData?.tmdbId || id;

          // Case 1: Type already known (No 404 risk)
          if (storedType) {
            tmdbData = await fetchDetails(storedType, lookupId);
          }

          // Case 2: Unknown type - Trial and Error (Trigger 404 once)
          if (!tmdbData) {
            // Movie trial
            tmdbData = await fetchDetails("movie", lookupId);
            if (tmdbData) {
              finalType = "movie";
            } else {
              // TV trial
              tmdbData = await fetchDetails("tv", lookupId);
              if (tmdbData) finalType = "tv";
            }
          }
        }

        // E. Result processing
        if (isMounted && (tmdbData || localData)) {
          const combined = {
            ...(tmdbData || {}),
            ...(localData || {}),
            media_type: finalType,
          };

          if (localData) {
            if (localData.title) combined.title = localData.title;
            if (localData.posterUrl) combined.posterUrl = localData.posterUrl;
            combined.id = id;
          }

          setMovieData(combined);

          // F. Multi-Level Persistence (Heal for future)
          if (tmdbData) {
            // Save to localStorage
            localStorage.setItem(`tmdb_type_${id}`, finalType);

            // Save to Backend (Sync)
            if (!localData || localData.mediaType !== finalType) {
              api
                .post(`/api/movies/${id}/sync-type`, {
                  mediaType: finalType,
                })
                .catch(() => {});
            }
          }
        }
      } catch (err) {
        if (isMounted) console.error(`[Card ${id}] Load Error:`, err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadItem();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading)
    return (
      <div className="movie-card placeholder-card" style={{ opacity: 0.5 }}>
        Loading...
      </div>
    );
  if (!movieData) return null; // Kichu na pele dekhabona

  const routePath =
    movieData.media_type === "tv" ? `/tv/${id}` : `/movie/${id}`;
  const displayTitle = movieData.title || movieData.name || "Unknown Title";
  const posterUrl = movieData.posterUrl
    ? movieData.posterUrl
    : getImageUrl(movieData.poster_path, "w500") ||
      "https://dummyimage.com/500x750/1e293b/ffffff&text=Movie+Poster";

  return (
    <Link to={routePath} className="movie-card">
      <div className="movie-poster-container">
        <img
          src={posterUrl}
          alt={displayTitle}
          className="movie-poster"
          onError={(e) => {
            e.target.src =
              "https://dummyimage.com/500x750/1e293b/ffffff&text=Poster";
          }}
        />
      </div>

      <div className="movie-info">
        <h3 className="movie-title" title={displayTitle}>
          {displayTitle}
        </h3>
        <div className="movie-category">
          {movieData.media_type === "tv" ? "TV Show" : "Movie"}
          {movieData.releaseDate
            ? ` • ${movieData.releaseDate.substring(0, 4)}`
            : movieData.release_date
              ? ` • ${movieData.release_date.substring(0, 4)}`
              : movieData.first_air_date
                ? ` • ${movieData.first_air_date.substring(0, 4)}`
                : ""}
        </div>
      </div>
    </Link>
  );
};

export default TMDBProfileCard;
