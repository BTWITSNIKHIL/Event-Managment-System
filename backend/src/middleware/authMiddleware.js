import User from "../models/user.js";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";
export const authenticatedUser = async (req, res, next) => {
  try {
    
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Authentication token missing" });
    }

   
    const decodedToken = jwt.verify(token, "Event@119");
    const { _id } = decodedToken;

    
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   
    req.user = user;

    
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ message: "Internal Server Error during authentication" });
  }
};



export const isAdmin = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.adminToken;
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Admin authentication required" 
      });
    }

    // Verify token
    const decoded = jwt.verify(token,"Event@119");
    
    // Find admin in database
    const admin = await Admin.findById(decoded.adminId).select("-password");
    
    if (!admin) {
      return res.status(401).json({ 
        success: false,
        message: "Admin not found" 
      });
    }

    // Attach admin to request object
    req.admin = admin;
    next();
    
  } catch (error) {
    console.error("Admin middleware error:", error);
    return res.status(401).json({ 
      success: false,
      message: "Invalid admin token" 
    });
  }
};