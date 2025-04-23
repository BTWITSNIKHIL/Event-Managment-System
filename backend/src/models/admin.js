import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema(
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
      validate: {
        validator: (v) => validator.isEmail(v) && v.endsWith('@poornima.org'),
        message: "Email must be a valid poornima.org email"
      }
    },
    password: {
      type: String,
      required: true,
      minLength: 8
    }
  },
  {
    timestamps: true,
  }
);

// Password hashing middleware
adminSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Password validation method
adminSchema.methods.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;