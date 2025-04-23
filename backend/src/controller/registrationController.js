import Participation from "../models/Registration.js";
import Event from "../models/Event.js";
import User from "../models/user.js";
import mongoose from "mongoose";

export const participateInEvent = async (req, res) => {
  const { eventId } = req.params;
  const { name, email, mobile } = req.body;

  try {
    // Check authentication
    if (!req.user?._id) {
      return res.status(401).send({ message: "Authentication required" });
    }

    // Fetch the logged-in user from DB
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate essential fields
    if (!name || !email || !mobile) {
      return res.status(400).json({ message: "Name, email, and mobile are required" });
    }

    // Get the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).send({ message: "Event not found" });
    }

    // Check if already participated
    const existingParticipation = await Participation.findOne({
      eventId,
      $or: [
        { userId: req.user._id },
        { userEmail: email },
        { userMobileNumber: mobile },
        { registrationNumber: user.registrationNumber }
      ]
    });

    if (existingParticipation) {
      return res.status(409).send({ 
        message: "Already registered for this event",
        details: {
          conflictType: existingParticipation.userId.equals(req.user._id)
            ? "user" 
            : existingParticipation.userEmail === email 
              ? "email" 
              : existingParticipation.userMobileNumber === mobile
                ? "mobile"
                : "registrationNumber"
        }
      });
    }

    // Name split logic
    const [userFirstName, ...rest] = name.trim().split(/\s+/);
    const userLastName = rest.join(' ') || '-';

    // Create participation using user data
    const participation = new Participation({
      userId: req.user._id,
      userFirstName,
      userLastName,
      userEmail: email,
      userMobileNumber: mobile,
      section: user.section,
      year: user.year,
      registrationNumber: user.registrationNumber,
      eventName: event.eventName,
      eventId: event._id,
    
    });
console.log(user.registrationNumber)
    await participation.save();

    return res.status(201).json({
      message: "Successfully registered for event",
      participation: {
        _id: participation._id,
        event: participation.eventName,
        date: participation.dateParticipated
      }
    });

  } catch (err) {
    console.error("Participation error:", err);
    return res.status(500).json({
      message: "Registration failed",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};


// In your eventController.js or userController.js
export const getMyParticipations = async (req, res) => {
  try {
    // Find all participations for the current user
    const participations = await Participation.find({ userId: req.user._id })
      .populate('eventId', 'eventName description startDateTime endDateTime venue')
      .exec();
console.log(participations)
    if (!participations.length) {
      return res.status(404).json({ message: "No participations found" });
    }

    // Format the response
    const formattedData = participations.map(participation => ({
      _id: participation._id,
      event: {
        _id: participation.eventId._id,
        name: participation.eventId.eventName,
        description: participation.eventId.description,
        startDate: participation.eventId.startDateTime,
        endDate: participation.eventId.endDateTime,
        venue: participation.eventId.venue
      },
      participationDate: participation.dateParticipated
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching participations",
      error: error.message
    });
  }
};
export const getEventParticipants = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Find participants and populate full user details
    const participants = await Participation.find({ eventId })
      .populate("userId", "firstName lastName email mobileNumber registrationNumber section year")
      .exec();

    // Format and send response - CRUCIAL FIX HERE 🔽
    res.status(200).json({
      success: true,
      count: participants.length,
      participants: participants.map((p) => ({
        _id: p.userId._id,
        userFirstName: p.userId.firstName,
        userLastName: p.userId.lastName,
        userEmail: p.userId.email,
        userMobileNumber: p.userId.mobileNumber,
        registrationNumber: p.userId.registrationNumber,
        section: p.userId.section,
        year: p.userId.year,
        participationDate: p.dateParticipated,
        // BEFORE: attended: p.attended === true ? "present" : "absent"
        attended: p.attended ? "present" : "absent" // ✅ Simplified boolean check
      })),
    });
  } catch (error) {
    console.error("Error fetching participants:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update attendance for participants of an event
// Mark attendance for event participants
// Mark attendance for event participants
export const markAttendance = async (req, res) => {
  const { eventId } = req.params;
  const { attendance } = req.body; // [{ id, attended }, ...]

  try {
    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    if (!attendance || !Array.isArray(attendance)) {
      return res.status(400).json({ message: "Invalid attendance data" });
    }

    // ✅ This is the key fix
    const bulkUpdates = attendance.map(({ id, attended }) => ({
      updateOne: {
        filter: { userId: id, eventId },
        update: { attended },
      },
    }));

    const result = await Participation.bulkWrite(bulkUpdates);

    const updatedParticipants = await Participation.find({ eventId })
      .populate('userId', 'firstName lastName email mobileNumber registrationNumber section year')
      .exec();

    res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      participants: updatedParticipants.map(p => ({
        _id: p.userId._id,
        userFirstName: p.userId.firstName,
        userLastName: p.userId.lastName,
        registrationNumber: p.userId.registrationNumber,
        attended: p.attended ? "present" : "absent",
      })),
    });
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
