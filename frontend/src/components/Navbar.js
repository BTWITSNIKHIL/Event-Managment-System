// Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiLogOut, FiUser, FiCalendar, FiStar } from "react-icons/fi";
import "./Navbar.css";

function Navbar() {
  const token = localStorage.getItem("token");

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:4000/user/logout", {}, {
        withCredentials: true,
      });
      localStorage.removeItem("token");
      window.location.reload();
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          <FiCalendar className="brand-icon" />
          <span className="gradient-text">EventHub</span>
        </Link>
      </div>
      
      <div className="nav-links">
        <Link to="/events" className="nav-link">
          <FiStar className="nav-icon" />
          Events
        </Link>
        <Link to="/participated-events" className="nav-link">
          <FiUser className="nav-icon" />
          My Events
        </Link>
      </div>

      <div className="auth-section">
        {token ? (
          <button onClick={handleLogout} className="logout-btn">
            <FiLogOut className="btn-icon" />
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="auth-link login">
              Login
            </Link>
            <Link to="/signup" className="auth-link signup">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;