import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import { Youtube, Twitter, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-content container">
        <div className="footer-icons">
          <a
            href="https://youtube.com/@srijit_pradhan?si=JkoJPh_1pX6nO58t"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
          >
            <Youtube className="social-icon" />
          </a>
          <a
            href="https://x.com/Srijit125"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <Twitter className="social-icon" />
          </a>
          <a
            href="https://www.instagram.com/srijitdev.in?igsh=MWY2bWF5bWF4eG1xcg=="
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <Instagram className="social-icon" />
          </a>
          <a
            href="https://www.facebook.com/share/1AxhVpoSJ3/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <Facebook className="social-icon" />
          </a>
        </div>

        <div className="info">
          <ul>
            <li>Audio Description</li>
            <li>Help Center</li>
            <li>Gift Cards</li>
            <li>Media Center</li>
            <li>Investor Relations</li>
            <li>Jobs</li>
            <li>Terms of Use</li>
            <li>Privacy</li>
            <li>Legal Notices</li>
            <li>Cookie Preferences</li>
            <li>
              <Link
                to="/about"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                About Us
              </Link>
            </li>
            <li>Contact Us</li>
          </ul>
        </div>

        <p className="copyright-text">© 2026 MoviFlex, Inc.</p>
      </div>
    </div>
  );
};

export default Footer;
