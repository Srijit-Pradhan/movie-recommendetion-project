import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-page glass">
      <div className="about-content">
        <h1>About MoviFlex</h1>
        <p className="about-subtitle">
          Your Ultimate Destination for Unlimited Entertainment
        </p>

        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            At MoviFlex, we believe that great stories bring people together.
            Our mission is to provide a seamless, beautiful, and intuitive
            platform where movie lovers and TV enthusiasts can discover, track,
            and explore the world's most incredible content completely ad-free.
          </p>
        </div>

        <div className="about-section">
          <h2>Why Choose Us?</h2>
          <ul>
            <li>
              <strong>Live Data:</strong> Powered by TMDB, our catalog is always
              up-to-date with the latest releases.
            </li>
            <li>
              <strong>Personalized Experience:</strong> Save favorites, bookmark
              watchlists, and easily track what you love.
            </li>
            <li>
              <strong>Stunning UI:</strong> Designed with a premium, symmetric
              dark mode approach for the ultimate viewing experience.
            </li>
          </ul>
        </div>

        <div className="about-section">
          <h2>Contact Us</h2>
          <p>
            Have feedback or suggestions? We'd love to hear from you. Connect
            with us on our social media platforms linked below or drop us an
            email anytime!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
