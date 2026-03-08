// Step 1: React theke hooks ar routing lagbe
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Step 2: Context import kora ja diye global state dhora jabe
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";

// Step 3: Icons nilam lucide-react theke
import {
  Sun,
  Moon,
  Search,
  User as UserIcon,
  Menu,
  X,
  Home as HomeIcon,
  Sliders,
  LogIn,
} from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  // ThemeContext theke theme (dark/light) ar change korar function nilam
  const { theme, toggleTheme } = useContext(ThemeContext);
  // AuthContext theke user er info ar logout function nichhi
  const { user, logout } = useContext(AuthContext);

  // page change korar jnno (redirect)
  const navigate = useNavigate();

  // State for mobile hamburger menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    // 'glass' class diye CSS e blur (glassmorphism) design toiri kora ache
    <nav className="navbar glass">
      <div className="nav-left">
        <Link to="/" className="nav-logo">
          MoviFlex
        </Link>
      </div>

      <div className="nav-right">
        {/* Mobile top bar icons (Hidden on desktop) */}
        <div className="mobile-nav-icons">
          <Link to="/" className="m-icon-link" aria-label="Home">
            <HomeIcon size={20} />
          </Link>
          <Link to="/search" className="m-icon-link" aria-label="Search">
            <Search size={20} />
          </Link>
          {user ? (
            <Link to="/profile" className="m-icon-link" aria-label="Profile">
              <UserIcon size={20} />
            </Link>
          ) : (
            <Link to="/login" className="m-icon-link" aria-label="Login">
              <LogIn size={20} />
            </Link>
          )}
        </div>

        <div
          className={`nav-links ${isMenuOpen ? "active" : ""} ${user?.isAdmin ? "sidebar-mode" : ""}`}
        >
          {/* Navigation icons specifically for desktop */}
          <Link
            to="/"
            className="nav-link desktop-nav-item"
            aria-label="Home"
            onClick={closeMenu}
          >
            <HomeIcon size={24} /> <span className="mobile-text">Home</span>
          </Link>

          {/* Step 5: Dynamic Routing check */}
          {/* Jodi user logged in thake (user object ache), tahole profile & logout dekhabo */}
          {user ? (
            <>
              <Link
                to="/profile"
                className="nav-link desktop-nav-item"
                aria-label="Profile"
                onClick={closeMenu}
              >
                <UserIcon size={24} />{" "}
                <span className="mobile-text">Profile</span>
              </Link>

              {/* Jodi user admin hoy, tobei pashapashi Admin page er link dekhabo */}
              {user.isAdmin && (
                <div className="admin-nav-group">
                  <span className="nav-section-title">Manage</span>
                  <Link
                    to="/admin/movies"
                    className="nav-link"
                    onClick={closeMenu}
                    style={{ fontWeight: "bold" }}
                  >
                    <Sliders size={20} />{" "}
                    <span className="mobile-text">Movies</span>
                  </Link>
                  <Link
                    to="/admin/users"
                    className="nav-link"
                    onClick={closeMenu}
                    style={{ fontWeight: "bold" }}
                  >
                    <UserIcon size={20} />{" "}
                    <span className="mobile-text">Users</span>
                  </Link>
                </div>
              )}
            </>
          ) : (
            /* User na thakle (login na korle) Sign In button dekhabo */
            <Link
              to="/login"
              className="btn"
              style={{ padding: "8px 16px", fontSize: "14px" }}
              onClick={closeMenu}
            >
              Sign In
            </Link>
          )}
        </div>

        <div className="nav-actions">
          <Link to="/search" className="top-search-link" aria-label="Search">
            <Search size={26} />
          </Link>
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <Moon size={26} /> : <Sun size={26} />}
          </button>

          {user && user.isAdmin && (
            <div
              className={`hamburger ${user?.isAdmin ? "show-desktop" : ""}`}
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
