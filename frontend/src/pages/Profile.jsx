// Step 1: Hooks o Router etc nchi
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react"; // Added LogOut icon
import TMDBProfileCard from "../components/TMDBProfileCard"; // TMDB Profile Card use korchi ekhon
import Loader from "../components/Loader";
import "./Profile.css";

const Profile = () => {
  // Context pabo user info r token API a auth header dewar jonne
  const {
    user,
    token,
    logout,
    updateUser,
    loading: authLoading,
  } = useContext(AuthContext);
  const navigate = useNavigate();

  // local page data
  const [profileData, setProfileData] = useState(null); // backend theke asa pura details (favs, history shoho)
  const [profileLoading, setProfileLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("favorites"); // Default kon tab active (select) thakbe UI e

  // Profile editing states
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editEmail, setEditEmail] = useState(user?.email || "");
  const [updateLoading, setUpdateLoading] = useState(false);

  // Helper Function: User er name er 1st letter ta as Avatar profile pic er jaigay use kre debo.
  const renderUserAvatar = () => {
    if (user && user.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return "";
  };

  // Profile update handler
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setUpdateLoading(true);
      await updateUser({ name: editName, email: editEmail });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile", error);
      alert("Failed to update profile");
    } finally {
      setUpdateLoading(false);
    }
  };

  // Reset edit fields when opening edit mode
  useEffect(() => {
    if (isEditing && user) {
      setEditName(user.name);
      setEditEmail(user.email);
    }
  }, [isEditing, user]);

  // Helper Function: jodi btn change hoy onno tab-e to kon loop theke TMDBProfileCard return korbe seta maintain korbe
  // Bises Drostobyo: backend ekhon TMDB er ID gulo String hisabe pathacche, tai amra id pass korchi map theke
  const renderTabContent = () => {
    if (!profileData) return null;

    if (activeTab === "favorites") {
      if (profileData.favorites && profileData.favorites.length > 0) {
        return profileData.favorites.map((id) => (
          <TMDBProfileCard key={id} id={id} />
        ));
      } else {
        return (
          <div
            className="no-data"
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "40px",
            }}
          >
            You haven't added any favorites yet.
          </div>
        );
      }
    }

    // Jodi bookmark dekhte chay..
    if (activeTab === "bookmarks") {
      if (profileData.bookmarks && profileData.bookmarks.length > 0) {
        return profileData.bookmarks.map((id) => (
          <TMDBProfileCard key={id} id={id} />
        ));
      } else {
        return (
          <div
            className="no-data"
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "40px",
            }}
          >
            You haven't bookmarked any movies yet.
          </div>
        );
      }
    }

    // Jodi watchlist dekhe ..
    if (activeTab === "watchlist") {
      if (profileData.watchlist && profileData.watchlist.length > 0) {
        return profileData.watchlist.map((id) => (
          <TMDBProfileCard key={id} id={id} />
        ));
      } else {
        return (
          <div
            className="no-data"
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "40px",
            }}
          >
            Your watchlist is empty.
          </div>
        );
      }
    }

    // Jodi history tab ashe
    if (activeTab === "history") {
      if (profileData.watchHistory && profileData.watchHistory.length > 0) {
        return profileData.watchHistory.map((id, idx) => (
          <TMDBProfileCard key={`${id}-${idx}`} id={id} />
        ));
      } else {
        return (
          <div
            className="no-data"
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "40px",
            }}
          >
            Your watch history is empty.
          </div>
        );
      }
    }

    return null;
  };

  // Step 2: Route Protection (jodi user log na thake URL diye asle jor kore take Login page back korabo)
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Logout handler
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Step 3: User er Full Profile fetch kora holo (Favorites, History shob aksathe Backend theke anbe kintu gulo hobe String ID)
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setProfileLoading(true);
        const { data } = await api.get("/api/users/profile");
        setProfileData(data); // Ekhane ekhon TMDB API er string IDs ache
      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        setProfileLoading(false);
      }
    };

    // Jodi user authenticated hoy ar token thake tobe amader API ta execute hobe
    if (token) {
      fetchProfileData();
    }
  }, [token, user]); // Jodi user update hoy athoba token change hoy, tahole notun kore page reload (state update) hobe

  // Data na asle loader
  if (authLoading || profileLoading || !profileData) return <Loader />;

  return (
    <div className="profile-page">
      {/* Step 4: Top User Header ba Profile card section */}
      <div className="profile-header">
        <div className="header-info">
          <div className="profile-avatar">{renderUserAvatar()}</div>
          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="edit-profile-form">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Name"
                required
              />
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="Email"
                required
              />
              <div className="edit-actions">
                <button type="submit" disabled={updateLoading}>
                  {updateLoading ? "Saving..." : "Save"}
                </button>
                <button type="button" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h2>{user ? user.name : ""}</h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="edit-btn-small"
                >
                  Edit
                </button>
              </div>
              <p>{user ? user.email : ""}</p>
            </div>
          )}
        </div>

        {/* Logout Button added here */}
        <button
          onClick={handleLogout}
          className="profile-logout-btn"
          title="Logout"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* Step 5: Option Button Gulo (Tabs) jakhne user choose korbe konta dekhte chy */}
      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === "favorites" ? "active" : ""}`}
          onClick={() => setActiveTab("favorites")}
        >
          Favorites ({profileData?.favorites?.length || 0})
        </button>
        <button
          className={`tab-btn ${activeTab === "bookmarks" ? "active" : ""}`}
          onClick={() => setActiveTab("bookmarks")}
        >
          Bookmarks ({profileData?.bookmarks?.length || 0})
        </button>
        <button
          className={`tab-btn ${activeTab === "watchlist" ? "active" : ""}`}
          onClick={() => setActiveTab("watchlist")}
        >
          Watchlist ({profileData?.watchlist?.length || 0})
        </button>
        <button
          className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          Watch History ({profileData?.watchHistory?.length || 0})
        </button>
      </div>

      {/* Step 6: Ekta grid layout theke function theke return howa values (movie card array) loop kre rendered kre dicchi */}
      <div className="movies-grid">{renderTabContent()}</div>
    </div>
  );
};

export default Profile;
