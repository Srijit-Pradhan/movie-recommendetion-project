// Step 1: React as always ar react-router er theke Link nilam (page refresh chhara jete)
import React from 'react';
import { Link } from 'react-router-dom';
import './MovieCard.css';

// Step 2: MovieCard Component. Eta props hisebhe backend theke pawa ekta single 'movie' ney.
const MovieCard = ({ movie }) => {
  // Jodi kono movie r chobi database e na thake, tokhon ei placeholder (fallback) chobbi ta dekhabo
  const defaultPoster = "https://dummyimage.com/500x750/1e293b/ffffff&text=Movie+Poster";

  // Step 3: Pura card take ekta boro Link banacchi, click korle details page e nie jabe.
  // URL e ebar _id er bodole TMDB r id jacche
  // TV show hole URL e tv/id o dite pari ba by default /movie/id e rakhchi amader local logic block na korar jonno.
  const routePath = movie.media_type === 'tv' ? `/tv/${movie.id || movie._id}` : `/movie/${movie.id || movie._id}`;
  
  const posterUrl = (movie.posterUrl && movie.posterUrl.trim()) 
    ? movie.posterUrl 
    : (movie.poster_path 
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
      : defaultPoster);
    
  // TV show e 'title' er jaygay 'name' asa tmdb theke
  const displayTitle = movie.title || movie.name || "Unknown Title";

  return (
    <Link to={routePath} className="movie-card">
      <div className="movie-poster-container">
        <img 
          src={posterUrl} 
          alt={displayTitle} 
          className="movie-poster"
          
          // Step 4: onError -> jodi chhobi aste giye fail kore tay try thekanor jonno
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = defaultPoster;
          }}
        />
      </div>
      
      <div className="movie-info">
        <h3 className="movie-title" title={displayTitle}>{displayTitle}</h3>
        {/* Release year ba category (M/TV) dekhate pari */}
        <div className="movie-category">
            {movie.media_type === 'tv' ? 'TV Show' : 'Movie'}
            {movie.releaseDate ? ` • ${movie.releaseDate.substring(0,4)}` : (movie.release_date ? ` • ${movie.release_date.substring(0,4)}` : (movie.first_air_date ? ` • ${movie.first_air_date.substring(0,4)}` : ''))}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;

