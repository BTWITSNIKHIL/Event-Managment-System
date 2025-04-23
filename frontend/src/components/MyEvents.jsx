import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiCalendar, FiMapPin, FiClock, FiArrowRightCircle } from "react-icons/fi";
import { motion } from "framer-motion";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParticipatedEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/my-participations",
          { withCredentials: true }
        );

        if (response.data && response.data.length > 0) {
          const formattedEvents = response.data.map(participation => ({
            ...participation,
            event: {
              ...participation.event,
              startDate: new Date(participation.event.startDate),
              endDate: new Date(participation.event.endDate)
            },
            participationDate: new Date(participation.participationDate)
          }));
          setEvents(formattedEvents);
        } else {
          toast.info("You haven't participated in any events yet");
        }
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error("Please login to view your events");
          navigate("/login");
        } else {
          toast.error("Failed to load your events");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchParticipatedEvents();
  }, [navigate]);

  const formatDate = (date) => {
    if (!(date instanceof Date)) return "Invalid Date";
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (date) => {
    if (!(date instanceof Date)) return "Invalid Date";
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-white flex items-center justify-center"
      >
        <div className="flex flex-col items-center space-y-4">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600"
          />
          <p className="text-purple-900 text-lg font-medium">Loading your events...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8"
    >
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-purple-900 mb-4 transform hover:scale-105 transition-transform">
            My Event Journey
          </h1>
          <p className="text-purple-600 text-lg">
            Relive your experiences and stay updated
          </p>
        </motion.div>

        <div className="space-y-8">
          {events.length === 0 ? (
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="text-center py-12 bg-white rounded-2xl shadow-lg border border-purple-50"
            >
              <div className="max-w-md mx-auto">
                <div className="mb-6 text-purple-400">
                  <FiCalendar className="w-16 h-16 mx-auto animate-pulse" />
                </div>
                <h3 className="text-2xl font-semibold text-purple-900 mb-4">
                  No Events Yet
                </h3>
                <p className="text-purple-600 mb-8">
                  Your participated events will appear here once you join an event
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/events')}
                  className="bg-purple-600 text-white px-8 py-3 rounded-full font-medium hover:bg-purple-700 transition-colors flex items-center justify-center mx-auto gap-2"
                >
                  <FiArrowRightCircle className="w-5 h-5" />
                  Explore Events
                </motion.button>
              </div>
            </motion.div>
          ) : (
            events.map((participation) => (
              <motion.div
                key={participation._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1.5 border border-purple-50"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-purple-900 mb-2">
                        {participation.event.name}
                      </h3>
                      <p className="text-purple-600">
                        {participation.event.description}
                      </p>
                    </div>
                    <motion.span 
                      whileHover={{ scale: 1.05 }}
                      className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      Registered
                    </motion.span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 text-purple-700">
                    <div className="flex items-center space-x-2">
                      <FiCalendar className="w-5 h-5 text-purple-500" />
                      <span>
                        {formatDateTime(participation.event.startDate)}
                      </span>
                      <span className="mx-1">-</span>
                      <span>
                        {formatDateTime(participation.event.endDate)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <FiMapPin className="w-5 h-5 text-purple-500" />
                      <span>{participation.event.venue}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-purple-100 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-purple-500 text-sm">
                      <FiClock className="w-4 h-4" />
                      <span>
                        Registered on {formatDate(participation.participationDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MyEvents;