// Navbar.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const pathname = useLocation().pathname.toLowerCase();
  if (pathname.includes("/team") || pathname.includes("/judge") || pathname.includes("/streamstats")) return null;

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">Collegiate Cubing Championship</Link>
      <div className={`nav-links ${isOpen ? 'open' : ''}`}>
        <Link to="/">Home</Link>
        <Link to="/brackets">Brackets</Link>
        <Link to="/statistics">Statistics</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/about">About</Link>
      </div>
      <div className="hamburger" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </nav>
  );
};
export default Navbar;
