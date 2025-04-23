import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ParticipatedEvents.css"; // You can style it as needed

function ParticipatedEvents() {
  const [participatedEvents, setParticipatedEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch participated events
  const fetchParticipatedEvents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // Assume token is saved in localStorage after login
      if (!token) {
        toast.error("Please log in to view your participated events!");
        return;
      }

      const response = await axios.get("http://localhost:4000/user/participated-events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setParticipatedEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching participated events:", error);
      setLoading(false);
      toast.error(error.response?.data?.message || "Error fetching participated events.");
    }
  };

  useEffect(() => {
    fetchParticipatedEvents(); // Automatically fetch events on page load
  }, []);

  if (loading) return <div>Loading your participated events...</div>;

  return (
    <div className="participated-events-container">
      <h2>Your Participated Events</h2>
      <button onClick={fetchParticipatedEvents} className="refresh-btn">Refresh Events</button>
      <div className="events-list">
        {participatedEvents.length > 0 ? (
          participatedEvents.map((event) => (
            <div key={event._id} className="event-card">
              <h3>{event.eventName}</h3>
              <p>{event.description}</p>
              <p><strong>Date:</strong> {new Date(event.dateTime.start).toLocaleString()}</p>
              <p><strong>Venue:</strong> {event.venue}</p>
            </div>
          ))
        ) : (
          <p>No events found. You have not participated in any events yet.</p>
        )}
      </div>
    </div>
  );
}

export default ParticipatedEvents;
