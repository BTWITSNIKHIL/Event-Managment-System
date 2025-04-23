// ParticipationForm.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

const ParticipationForm = ({ event, onClose, onParticipate }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    section: "",
    year: "",
    registrationNumber: ""
  });
  const [loading, setLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});

  const showToast = (message, background) => {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: background,
    }).showToast();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/me", { 
          withCredentials: true 
        });
        
        setFormData({
          name: `${response.data.firstName} ${response.data.lastName}`,
          email: response.data.email,
          mobile: response.data.mobileNumber || "",
          section: response.data.section,
          year: response.data.year,
          registrationNumber: response.data.registrationNumber
        });

      } catch (error) {
        showToast("❌ Failed to load user data", "linear-gradient(to right, #ff416c, #ff4b2b)");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const validateForm = () => {
    const errors = {};
    const mobileRegex = /^[0-9]{10}$/;

    if (!formData.mobile.match(mobileRegex)) {
      errors.mobile = "Invalid mobile number (10 digits required)";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast("⚠️ Please fix form errors", "linear-gradient(to right, #ff9f43, #ff6b6b)");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:4000/${event._id}/participate`,
        formData,
        { withCredentials: true }
      );

      if (response.status === 201) {
        showToast("🎉 Registration completed successfully!", "linear-gradient(to right, #00b09b, #96c93d)");
        onParticipate();
        onClose();
      }
    } catch (error) {
      let errorMessage = "Registration failed";
      
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = error.response.data.message || "Validation error";
            break;
          case 401:
            errorMessage = "Authentication required - Please login again";
            break;
          case 404:
            errorMessage = "Event not found";
            break;
          case 409:
            errorMessage = error.response.data.message || "Already registered";
            break;
          default:
            errorMessage = `Server error (${error.response.status})`;
        }
      } else if (error.request) {
        errorMessage = "Network error - Please check your connection";
      }

      showToast(`❌ ${errorMessage}`, "linear-gradient(to right, #ff416c, #ff4b2b)");
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md text-center">
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Participate in {event.eventName}</h2>
        
        <form onSubmit={handleSubmit} noValidate>
          {/* Read-only Fields */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Event Name</label>
            <input
              type="text"
              value={event.eventName}
              className="w-full p-2 border rounded bg-gray-100"
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded bg-gray-100"
              value={formData.name}
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded bg-gray-100"
              value={formData.email}
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Section</label>
            <input
              type="text"
              className="w-full p-2 border rounded bg-gray-100"
              value={formData.section}
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Year</label>
            <input
              type="text"
              className="w-full p-2 border rounded bg-gray-100"
              value={
                formData.year === "1" ? "1st Year" :
                formData.year === "2" ? "2nd Year" :
                formData.year === "3" ? "3rd Year" : "4th Year"
              }
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Registration Number</label>
            <input
              type="text"
              className="w-full p-2 border rounded bg-gray-100"
              value={formData.registrationNumber}
              readOnly
            />
          </div>

          {/* Editable Mobile Field */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Mobile Number *</label>
            <input
              type="tel"
              required
              className={`w-full p-2 border rounded ${
                formErrors.mobile ? "border-red-500" : ""
              }`}
              value={formData.mobile}
              onChange={(e) => {
                setFormData({...formData, mobile: e.target.value});
                setFormErrors(prev => ({...prev, mobile: ""}));
              }}
              placeholder="Enter 10-digit mobile number"
              pattern="[0-9]{10}"
            />
            {formErrors.mobile && (
              <p className="text-red-500 text-sm mt-1">{formErrors.mobile}</p>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParticipationForm;