import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    mobileNumber,
    section,
    year,
    registrationNumber
  } = req.body;

  try {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !mobileNumber ||
      !section ||
      !year ||
      !registrationNumber
    ) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    if (!email.endsWith("@poornima.org")) {
      return res
        .status(400)
        .json({ message: "Email must be from poornima.org domain" });
    }

    if (!["A", "B", "C", "D"].includes(section)) {
      return res.status(400).json({ message: "Section must be A, B, C, or D" });
    }

    if (![1, 2, 3, 4].includes(Number(year))) {
      return res.status(400).json({ message: "Year must be 1 to 4" });
    }

    const regEx = /^piet\d{2}[a-z]{2}\d{3}$/i;
    if (!regEx.test(registrationNumber) || registrationNumber.length !== 11) {
      return res.status(400).json({
        message: "Registration number must follow 'piet21cs116' format and be 11 characters long",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { registrationNumber }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this Email or Registration Number" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and Confirm Password do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      mobileNumber,
      section,
      year,
      registrationNumber,
    });

    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error during user registration:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).send({ message: "Please fill all required fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User Not Found" });
    }

    console.log("User email:", user.email);
    console.log("Stored hashed password:", user.password);

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isPasswordMatched);

    if (!isPasswordMatched) {
      return res.status(403).send({ message: "Invalid Password" });
    }

    const token = await jwt.sign({ _id: user._id }, "Event@119", {
      expiresIn: "7d",
    });

    // Setting cookie with httpOnly, secure, and sameSite options
    res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "None", // for cross-site cookies with Netlify
});

    return res.status(200).send({ message: "Login Successfully" });
  } catch (err) {
    console.error("Error during login", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const logOut = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true, // Make sure this matches the cookie settings used when logging in
    path: "/",      // Specify the path if it was set during login
  }).send({ message: "Logout Successful" });
};



export const getProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      mobileNumber,
      registrationNumber,
      section,
      year
    } = req.user;

    return res.status(200).json({
      firstName,
      lastName,
      email,
      mobileNumber,
      registrationNumber,
      section,
      year
    });
  } catch (err) {
    console.error("Error fetching profile data:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -__v');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
