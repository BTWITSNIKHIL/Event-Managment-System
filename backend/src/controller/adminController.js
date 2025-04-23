import jwt from "jsonwebtoken";
import validator from "validator";
import Admin from "../models/admin.js";

// Admin Login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required" 
      });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    // Verify password
    const isMatch = await admin.validatePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { adminId: admin._id },
     "Event@119",// Use environment variable
      { expiresIn: '1d' }
    );

    // Set cookie with security options
    res.cookie("adminToken", token, {
      expires: new Date(Date.now() + 8 * 3600000), // 8 hours
      httpOnly: true,
     secure: true,
      sameSite: 'None',
      path: '/'
    });

    // Send response without password
    const adminData = admin.toObject();
    delete adminData.password;

    res.status(200).json({
      success: true,
      message: "Login successful",
      admin: adminData
    });

  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};

// Add New Admin
export const addAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required" 
      });
    }

    // Validate email format
    if (!validator.isEmail(email) || !email.endsWith('@poornima.org')) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid Poornima organization email" 
      });
    }

    // Check for existing admin
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ 
        success: false,
        message: "Admin already exists" 
      });
    }

    // Create new admin
    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      password
    });

    await newAdmin.save();

    // Remove password from response
    const adminData = newAdmin.toObject();
    delete adminData.password;

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin: adminData
    });

  } catch (error) {
    console.error("Add admin error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};

// Logout Admin
export const logoutAdmin = (req, res) => {
  try {
    res.clearCookie('adminToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      path: '/'
    }).status(200).json({ 
      success: true,
      message: "Logout successful" 
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error during logout" 
    });
  }
};
