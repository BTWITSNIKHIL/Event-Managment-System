import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDb from "./config/database.js";
import authRoute from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoute.js";
import userParticipatedEvents from "./routes/userRoutes.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import adminRouter from "./routes/adminRoutes.js";
import Reportrouter from "./routes/reportRoutes.js";

dotenv.config({ path: './src/config/.env' });

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
  origin: ["https://poornima-events.netlify.app", "http://localhost:5174"],
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));

app.use("/", authRoute);
app.use("/event", eventRoutes);
app.use("/", userParticipatedEvents);
app.use("/",adminRouter);
app.use("/api/report",Reportrouter);

connectDb()
  .then(() => {
    console.log("Connected to database");
    app.listen(4000, () => {
      console.log(`Server listening on port 4000`);
      console.log(process.env.CLOUDINARY_CLOUD_NAME);
      console.log(process.env.CLOUDINARY_API_KEY)
      console.log(process.env.CLOUDINARY_API_SECRET);
    });
  })
  .catch((err) => {
    console.error("Connection error:", err);
  });
