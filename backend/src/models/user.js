import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 30,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 30,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@poornima\.org$/,
        "Email must be from poornima.org domain",
      ],
    },
    password: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Mobile number must be 10 digits"],
    },
    section: {
      type: String,
      required: true,
      enum: ["A", "B", "C", "D"],
    },
    year: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4],
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^piet\d{2}[a-z]{2}\d{3}$/i,
        "Registration number must start with 'piet' and follow the pattern e.g. piet21cs116",
      ],
      maxlength: 11,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.validatePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw new Error("Error while validating password: " + err.message);
  }
};

const User = new mongoose.model("User", userSchema);
export default User;
