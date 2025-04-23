import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useNavigate } from "react-router-dom";
export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState(null);
  const location = useLocation();
const navigate = useNavigate();
  // Function to show toast notifications
  const showToast = (message, type) => {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: type === "success" ? "green" : "red",
    }).showToast();
  };

  // Check user login status and profile
  const checkLoginStatus = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/user/profile", {
        withCredentials: true,
      });
      if (response.status === 200) {
        setIsLoggedIn(true);
        setProfile(response.data);
      }
    } catch (error) {
      setIsLoggedIn(false);
      setProfile(null);
      showToast("Failed to fetch user data", "error");
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, [location]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:4000/api/user/logout", {}, { withCredentials: true });
      setIsLoggedIn(false);
      setProfile(null);
      showToast("Logged out successfully!", "success");
      navigate('/')
    } catch (error) {
      showToast("Logout failed. Try again!", "error");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-menu")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="header flex justify-between items-center py-2 px-4 bg-gray-200 shadow-xl border">
      <div className="logo text-2xl sm:text-3xl px-4 font-bold text-[#755df6]">
        DEMS
      </div>

      <nav className="navbar flex items-center">
        <ul className="hidden sm:flex space-x-6 px-6 py-3 rounded-lg">
          <li><Link to="/" className="text-[#755df6] font-semibold text-lg hover:text-gray-700">Home</Link></li>
          <li><Link to="/events" className="text-[#755df6] font-semibold text-lg hover:text-gray-700">Events</Link></li>
          <li><Link to="/gallery" className="text-[#755df6] font-semibold text-lg hover:text-gray-700">Gallery</Link></li>
          <li><Link to="/about" className="text-[#755df6] font-semibold text-lg hover:text-gray-700">About Us</Link></li>
        </ul>

        <div className="relative profile-menu ml-4">
          <button 
            className="w-10 h-10 rounded-full bg-[#755df6] text-white flex items-center justify-center hover:bg-[#6048d4] focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            👤
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border z-50">
              <ul className="py-2 text-left">
                {isLoggedIn ? (
                  <>
                    <li>
                      <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        {profile?.name || "Profile"}
                      </Link>
                    </li>
                    <li>
                      <Link to="/myevents" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        My Events
                      </Link>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link to="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Login
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};
