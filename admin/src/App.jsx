import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminHomepage from "./components/AdminHomepage";
import StudentData from "./components/StudentData";
import AdminLogin from "./components/AdminLogin";
import Navbar from "./components/Navbar";
import AddAdmin from "./components/AddAdmin";
import Logout from "./components/Logout";
import CreateEvent from "./components/CreateEvent";
import EditEvent from "./components/EditEvent";
import ReportsUploadPage from "./components/ReportsUploadPage ";
import ReportsListPage from "./components/ReportsListPage ";
import AttendancePage from "./components/AttendancePage";


const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/logout" element={<Logout />} />

        <Route path="/admin-dashboard" element={<AdminHomepage />} />
        <Route path="/event/:eventId/participate" element={<StudentData />} />
        <Route path="/add-admin" element={<AddAdmin />} />
        <Route path="/admin/createEvent" element={<CreateEvent/>} />
        <Route path="/admin/events/edit/:eventId" element={<EditEvent />} />
        <Route path="/admin/upload-reports" element={<ReportsUploadPage />} />
        <Route path="/admin/reports" element={<ReportsListPage />} />
        <Route path="/admin/event/:eventId/attendance" element={<AttendancePage />} />
      </Routes>

      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={1000} hideProgressBar />
    </Router>
  );
};

export default App;
