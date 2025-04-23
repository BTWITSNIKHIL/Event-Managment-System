import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import React from "react";
import HomePage from "./components/HomePage";
import AuthPage from "./components/AuthPage";
import { Header } from "./components/Header";
import Profile from "./components/Profile"; // Import Profile component
import GallerySection from "./components/GallerySection";
// import MyEventsForm from "./components/MyEvents";
import MyEvents from "./components/MyEvents";
import AllEvents from "./components/AllEvents";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AboutUs from "./components/AboutUsSection";

function App() {
  return (
    <>
      <Router>
        <Header /> {/* Include Header on top of the app */}
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* HomePage route */}
          <Route path="/auth" element={<AuthPage />} /> {/* AuthPage route */}
          <Route path="/profile" element={<Profile />} /> {/* Profile route */}
          <Route path="/gallery" element={<GallerySection />} />{" "}
          <Route path="/login" element={<Login/>} />{" "}
          <Route path="/events" element={<AllEvents/>} />{" "}
          <Route path="/signup" element={<Signup/>} />{" "}
          <Route path="/about" element={<AboutUs/>} />{" "}
          {/* Profile route */}
          <Route path="/myevents" element={<MyEvents/>} />{" "}
          {/* Profile route */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
