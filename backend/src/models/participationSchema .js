// models/Participation.js
import mongoose from "mongoose";

const participationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  userFirstName: {
    type: String,
    required: true
  },
  userLastName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userMobileNumber: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  registrationNumber: {
    type: String,
    required: true
  },
  eventName: {
    type: String,
    required: true
  },
  dateParticipated: {
    type: Date,
    default: Date.now
  }
});

participationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

const Participation = mongoose.model("Participation", participationSchema);
export default Participation;