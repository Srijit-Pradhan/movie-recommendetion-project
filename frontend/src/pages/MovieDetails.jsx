/**
 * Movie Details Page (UI/Presentation Layer)
 * Ei page ta shudhu UI dekhano ebong orchestrator (hook) theke data anar jonno.
 * This page is responsible for UI presentation and interactions via hooks.
 */
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Play, Heart, Check, Bookmark, Clock, Star } from "lucide-react";
import Loader from "../components/Loader";
import TrailerModal from "../components/TrailerModal";
import { getImageUrl } from "../utils/tmdb";
// Hook layer import korchi
import { useMovieDetail } from "../hooks/useMovieDetail";
import "./MovieDetails.css";

const MovieDetails = () => {
  // Step 1: URL theke ID ta niye nilam
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Step 2: Orchestration Layer (Hook) Call
   * Sob complex logic ei hook tar bhetore ache. UI layer sudu eta use kore.
   * All complex logic is encapsulated in this hook.
   */
  const {
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
  } = useMovieDetail(id);

  // Loading ba Error handling
  if (loading) return <Loader />;
  if (!movie)
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        Content not found
      </div>
    );

  // UI er jonno data ready korchi
  const displayTitle = movie.title || movie.name;
  const releaseYear = movie.releaseDate
    ? movie.releaseDate.slice(0, 4)
    : movie.release_date
      ? movie.release_date.slice(0, 4)
      : movie.first_air_date
        ? movie.first_air_date.slice(0, 4)
        : "N/A";

  const posterUrl = movie.posterUrl
    ? movie.posterUrl
    : getImageUrl(movie.poster_path, "w500") ||
      "https://dummyimage.com/500x750/1e293b/ffffff&text=Movie+Poster";

  // Trailer link logic
  let trailerLink = movie.trailerLink || "";
  if (!trailerLink && movie.videos?.results?.length > 0) {
    const ytVideo =
      movie.videos.results.find(
        (v) => v.site === "YouTube" && v.type === "Trailer",
      ) || movie.videos.results[0];
    if (ytVideo) {
      trailerLink = `https://www.youtube.com/watch?v=${ytVideo.key}`;
    }
  }

  // Local Average Rating calculation for UI
  let avgRating = "No local ratings yet";
  if (localMovie?.ratings?.length > 0) {
    let sum = localMovie.ratings.reduce((acc, curr) => acc + curr.rating, 0);
    avgRating = `Local Avg: ${(sum / localMovie.ratings.length).toFixed(1)}`;
  }

  return (
    <div className="movie-details-page">
      <div className="details-layout">
        {/* Poster Section */}
        <div className="details-poster-container">
          <img
            src={posterUrl}
            alt={displayTitle}
            className="details-poster"
            onError={(e) => {
              e.target.src =
                "https://dummyimage.com/500x750/1e293b/ffffff&text=No+Image";
            }}
          />
        </div>

        {/* Info & Action Section */}
        <div className="details-info">
          <h1>{displayTitle}</h1>

          {/* Metadata: Year, Genre, TMDB Rating */}
          <div className="details-meta">
            <span>{releaseYear}</span>
            <span>•</span>
            <span>
              {movie.genres
                ? movie.genres.map((g) => g.name).join(", ")
                : "Various"}
            </span>
            <span>•</span>
            <span>
              TMDB:{" "}
              <Star
                size={14}
                color="#eab308"
                style={{ marginLeft: "2px", marginRight: "2px" }}
              />
              {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
            </span>
          </div>

          {/* Local Rating (Stars) UI */}
          <div
            className="movie-rating"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "15px",
              paddingBottom: "15px",
            }}
          >
            <div style={{ display: "flex" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  fill={(hoverRating || rating) >= star ? "#eab308" : "none"}
                  color={
                    (hoverRating || rating) >= star ? "#eab308" : "currentColor"
                  }
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => submitRating(star)}
                  style={{
                    cursor: "pointer",
                    transition: "color 0.2s",
                    marginRight: "2px",
                  }}
                />
              ))}
            </div>
            <span style={{ fontWeight: "600", fontSize: "1.1rem" }}>
              {avgRating}{" "}
              {localMovie?.ratings?.length > 0 && (
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-color-light)",
                    opacity: 0.8,
                  }}
                >
                  ({localMovie.ratings.length} votes)
                </span>
              )}
            </span>
          </div>

          <p className="details-description">
            {movie.overview || "Overview not available."}
          </p>

          {/* Action Buttons (Favorites, Watchlist, etc.) */}
          <div className="details-actions">
            {trailerLink ? (
              <button className="btn" onClick={() => setIsModalOpen(true)}>
                <Play size={20} /> Watch Trailer
              </button>
            ) : (
              <button
                className="btn"
                style={{ opacity: 0.5, cursor: "not-allowed" }}
                disabled
              >
                No Trailer Found
              </button>
            )}

            {/* User favorite status update */}
            <button
              className="btn btn-secondary action-btn"
              onClick={toggleFavorite}
            >
              {isFavorite ? (
                <>
                  <Check size={20} /> Saved to Favorites
                </>
              ) : (
                <>
                  <Heart size={20} /> Add to Favorites
                </>
              )}
            </button>
            <button
              className="btn btn-secondary action-btn"
              onClick={toggleBookmark}
            >
              <Bookmark
                size={20}
                fill={isBookmarked ? "currentColor" : "none"}
              />{" "}
              {isBookmarked ? "Bookmarked" : "Bookmark"}
            </button>
            <button
              className="btn btn-secondary action-btn"
              onClick={toggleWatchlist}
            >
              <Clock size={20} fill={inWatchlist ? "currentColor" : "none"} />{" "}
              {inWatchlist ? "In Watchlist" : "Watchlist"}
            </button>
          </div>
        </div>
      </div>

      {trailerLink && (
        <TrailerModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          trailerLink={trailerLink}
        />
      )}
    </div>
  );
};

export default MovieDetails;
