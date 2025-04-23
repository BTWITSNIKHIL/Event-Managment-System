import express from "express";
import { getProfile, login, logOut, signUp,getCurrentUser } from "../controller/authController.js";
import { authenticatedUser } from "../middleware/authMiddleware.js";

const authRoute = express.Router();

authRoute.post('/api/user/signup', signUp);
authRoute.post('/api/user/login', login); 
authRoute.post('/api/user/logout', logOut);
authRoute.get('/me',authenticatedUser,getCurrentUser);
authRoute.get("/api/user/profile",authenticatedUser,getProfile)
export default authRoute;
