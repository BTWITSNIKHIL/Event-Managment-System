import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaUsers,
  FaEdit,
  FaTrash
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const AdminHomepage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/event/user/getAllEvents", {
          withCredentials: true
        });
        
        const formattedEvents = data.map(event => ({
          ...event,
          startDate: new Date(event.dateTime.start),
          endDate: new Date(event.dateTime.end),
          participantCount: event.participants?.length || 0
        }));
        
        setEvents(formattedEvents);
      } catch (err) {
        setError("Failed to load events");
        if(err.response?.status === 401) navigate("/admin/login");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [navigate]);

  const handleDelete = async (eventId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this event?");
      if (!confirmDelete) return;

      await axios.delete(`http://localhost:4000/event/admin/deleteEvent/${eventId}`, {
        withCredentials: true
      });
      
      setEvents(events.filter(event => event._id !== eventId));
      toast.success("Event deleted successfully");
    } catch (err) {
      toast.error("Failed to delete event");
    }
  };

  const filteredEvents = events.filter(event => {
    const eventYear = event.startDate.getFullYear();
    const eventMonth = event.startDate.toLocaleString("default", { month: "long" });
    return (
      event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedYear === "All" || eventYear === Number(selectedYear)) &&
      (selectedMonth === "All" || eventMonth === selectedMonth)
    );
  });

  const years = [...new Set(events.map(event => 
    event.startDate.getFullYear()
  ))].sort((a, b) => b - a);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-20"> {/* Added pt-20 for navbar spacing */}
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6 mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Event Management Dashboard
        </h1>
      </motion.div>

      {/* Filters Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-md p-6 mb-6"
      >
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex gap-4 items-center">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {["All", "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ].map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredEvents.map(event => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/admin/events/edit/${event._id}`);
                  }}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(event._id);
                  }}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <FaTrash />
                </button>
              </div>

              {/* Event Content */}
              <div 
                onClick={() => navigate(`/event/${event._id}/participate`, { state: { event } })}
                className="p-6 cursor-pointer"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {event.eventName}
                </h3>
                <p className="text-gray-600 mb-4">{event.description}</p>

                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-indigo-500" />
                    <span>
                      {event.startDate.toLocaleDateString()} - {event.endDate.toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaClock className="text-indigo-500" />
                    <span>
                      {event.startDate.toLocaleTimeString()} - {event.endDate.toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-indigo-500" />
                    <span>{event.venue}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaUsers className="text-indigo-500" />
                    <span>{event.participantCount} Participants</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-gray-500"
        >
          <div className="text-4xl mb-4">📭</div>
          <p className="text-xl">No events found matching your criteria</p>
        </motion.div>
      )}
    </div>
  );
};

export default AdminHomepage;