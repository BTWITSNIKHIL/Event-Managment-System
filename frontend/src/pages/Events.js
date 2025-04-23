import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "/dist/ReactToastify.css";
import "./Event.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [participatedEvents, setParticipatedEvents] = useState([]); // New state to track participated events

  useEffect(() => {
    // Fetch all events from the backend
    axios
      .get("http://localhost:4000/event/user/getAllEvents")
      .then((response) => {
        setEvents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const handleParticipate = async (eventId) => {
    try {
      // Assuming the user is logged in and their token is stored in localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to participate!");
        return;
      }

      const res = await axios.post(
        `http://localhost:4000/user/${eventId}/participate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // After successful participation, update the participatedEvents state
      setParticipatedEvents((prev) => [...prev, eventId]);

      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error while participating in event.");
    }
  };

  if (loading) return <div>Loading events...</div>;

  return (
    <div className="events-container">
      <h2>All Events</h2>
      <div className="events-list">
        {events.map((event) => (
          <div key={event._id} className="event-card">
            <h3>{event.eventName}</h3>
            <p><strong>Description:</strong> {event.description}</p>
            <p><strong>Date:</strong> {new Date(event.dateTime.start).toLocaleDateString()}</p>
            <p><strong>Start Time:</strong> {new Date(event.dateTime.start).toLocaleTimeString()}</p>
            <p><strong>End Time:</strong> {new Date(event.dateTime.end).toLocaleTimeString()}</p>
            <p><strong>Venue:</strong> {event.venue}</p>
            <button
              className="participate-btn"
              onClick={() => handleParticipate(event._id)}
              disabled={participatedEvents.includes(event._id)} // Disable button if already participated
            >
              {participatedEvents.includes(event._id) ? "Participated" : "Participate"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Events;
