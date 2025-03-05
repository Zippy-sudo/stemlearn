import React from "react";
import { Facebook, Instagram } from "lucide-react"; // Import icons
import "../Footer.css"; // Import styles

const Footer = () => {
  return (
    <footer className="footer bg-main-yellow">
      <div className="footer-content">
        <h1>Contact Us</h1>
        <p className="bg-transparent">&copy; 2025 STEMLearn. All rights reserved.</p>
        <div className="social-links">
          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <Facebook size={24} />
          </a>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <Instagram size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
