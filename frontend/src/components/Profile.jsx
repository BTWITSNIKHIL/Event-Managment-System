// Profile.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/user/profile", { 
          withCredentials: true 
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching profile", error);
      }
    };

    fetchProfile();
  }, []);
console.log(user)
  if (!user) {
    return <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-600 flex items-center justify-center p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-600 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-[#755df6] mb-6">User Profile</h2>
        <div className="space-y-6">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-md">
            <span className="font-semibold text-lg text-gray-800">First Name:</span>
            <span className="text-lg text-gray-600">{user.firstName}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-md">
            <span className="font-semibold text-lg text-gray-800">Last Name:</span>
            <span className="text-lg text-gray-600">{user.lastName}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-md">
            <span className="font-semibold text-lg text-gray-800">Mobile:</span>
            <span className="text-lg text-gray-600">{user.mobileNumber}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-md">
            <span className="font-semibold text-lg text-gray-800">Email:</span>
            <span className="text-lg text-gray-600">{user.email}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-md">
            <span className="font-semibold text-lg text-gray-800">Section:</span>
            <span className="text-lg text-gray-600">{user.section}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-md">
            <span className="font-semibold text-lg text-gray-800">Year:</span>
            <span className="text-lg text-gray-600">
              {user.year === "1" ? "1st Year" :
               user.year === "2" ? "2nd Year" :
               user.year === "3" ? "3rd Year" : "4th Year"}
            </span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-md">
            <span className="font-semibold text-lg text-gray-800">Registration Number:</span>
            <span className="text-lg text-gray-600">{user.registrationNumber}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;