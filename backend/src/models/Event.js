// models/Event.js
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  eventName: String,
  description: String,
  dateTime: {
    start: Date,
    end: Date
  },
  venue: String,
  poster: String,
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participation'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);