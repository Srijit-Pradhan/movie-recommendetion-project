import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchPersonDetails,
  fetchPersonMovies,
  getImageUrl,
} from "../utils/tmdb";
import MovieCard from "../components/MovieCard";
import Loader from "../components/Loader";
import { ArrowLeft } from "lucide-react";
import "./PersonDetails.css";

const PersonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Component load holei ei function run korbe
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // TMDB theke person details ar tar movies/tv shows eksathe call korchi
        const personData = await fetchPersonDetails(id);
        const creditsData = await fetchPersonMovies(id);

        setPerson(personData);
        // Only show items with posters (jate UI kharap na lage)
        const itemsWithPosters = creditsData.cast.filter(
          (item) => item.poster_path,
        );

        // Remove duplicates (e.g. jodi ekjon ek e movie te actor+director dutoi hoy, tmdb age duplicate return kore)
        const uniqueIds = new Set();
        const uniqueCredits = [];
        for (const item of itemsWithPosters) {
          const uniqueKey = `${item.id}-${item.media_type}`;
          if (!uniqueIds.has(uniqueKey)) {
            uniqueIds.add(uniqueKey);
            uniqueCredits.push(item);
          }
        }

        // Popularity hisabe sort kora holo sorting
        uniqueCredits.sort((a, b) => b.popularity - a.popularity);

        setCredits(uniqueCredits);
      } catch (error) {
        console.error("Error fetching person details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

  // Loading spinner
  if (loading) return <Loader />;
  if (!person)
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        Content not found
      </div>
    );

  const profileImg = getImageUrl(person.profile_path, "h632");
  const defaultProfile =
    "https://dummyimage.com/500x750/1e293b/ffffff&text=No+Photo";

  return (
    <div className="person-details-page" style={{ padding: "20px" }}>
      {/* Back button (user jate last page e fire jete pare easily) */}
      <button
        onClick={() => navigate(-1)}
        className="back-btn"
        style={{
          background: "transparent",
          color: "var(--text-color)",
          border: "none",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          cursor: "pointer",
          marginBottom: "20px",
          fontSize: "16px",
        }}
      >
        <ArrowLeft size={20} /> Back
      </button>

      {/* Person er main biography and info section */}
      <div className="person-header" style={{ marginBottom: "40px" }}>
        <div className="person-info" style={{ width: "100%" }}>
          {/* Profile Image floated to the right */}
          <div
            className="person-image-container"
            style={{
              float: "right",
              width: "300px",
              height: "450px",
              borderRadius: "15px",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              marginLeft: "30px",
              marginBottom: "20px",
            }}
          >
            <img
              src={profileImg || defaultProfile}
              alt={person.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              onError={(e) => {
                e.target.src = defaultProfile;
              }}
            />
          </div>

          <h1
            style={{
              fontSize: "2.5rem",
              marginBottom: "10px",
              color: "var(--primary-color)",
            }}
          >
            {person.name}
          </h1>
          <h3 style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
            {person.known_for_department}
          </h3>

          <div
            className="biography"
            style={{ lineHeight: "1.6", fontSize: "1.1rem" }}
          >
            <h4 style={{ marginBottom: "10px", color: "var(--text-light)" }}>
              Biography
            </h4>
            <p style={{ textAlign: "justify" }}>
              {person.biography || "No biography available."}
            </p>
          </div>

          {/* Chotto grid baniye details rakhchi */}
          <div
            className="personal-info-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "20px",
              marginTop: "30px",
              clear: "both",
            }}
          >
            <div>
              <strong style={{ display: "block", color: "var(--text-muted)" }}>
                Birthday
              </strong>
              <span>{person.birthday || "Unknown"}</span>
            </div>
            {person.deathday && (
              <div>
                <strong
                  style={{ display: "block", color: "var(--text-muted)" }}
                >
                  Day of Death
                </strong>
                <span>{person.deathday}</span>
              </div>
            )}
            <div>
              <strong style={{ display: "block", color: "var(--text-muted)" }}>
                Place of Birth
              </strong>
              <span>{person.place_of_birth || "Unknown"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tar acted Movies or TV Shows er grid */}
      <div className="person-movies-section">
        <h2
          style={{
            marginBottom: "20px",
            borderBottom: "2px solid var(--primary-color)",
            paddingBottom: "10px",
            display: "inline-block",
          }}
        >
          Known For
        </h2>
        <div className="movies-grid">
          {credits.length > 0 ? (
            credits.map((movie) => (
              <MovieCard
                key={`${movie.id}-${movie.media_type || "credit"}`}
                movie={movie}
              />
            ))
          ) : (
            <p>No movies or TV shows found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonDetails;
