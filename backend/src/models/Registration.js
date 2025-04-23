import mongoose from "mongoose";
const participationSchema = new mongoose.Schema({
  userId: {          // Add userId to reference the user directly
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userFirstName: {
    type: String,
    required: true,
  },
  userLastName: {
    type: String,
    required: true,
  },
  userMobileNumber: {
    type: String,
    required: true,
  },
  eventName: {
    type: String,
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event", 
    required: true,
  },
  dateParticipated: {
    type: Date,
    default: Date.now,
  },
  attended: {
    type: Boolean,
    default: false
  }
});
const Participation =new mongoose.model("Participation", participationSchema);

export default Participation;