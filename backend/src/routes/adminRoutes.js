import express from "express"
import { addAdmin, loginAdmin, logoutAdmin } from '../controller/adminController.js';
import { isAdmin } from "../middleware/authMiddleware.js";
const adminRouter = express.Router();

adminRouter.post("/admin/login",loginAdmin);
adminRouter.post("/admin/newAdmin",isAdmin, addAdmin);
adminRouter.post("/admin/logout", logoutAdmin);
adminRouter.get("/admin-verify",isAdmin);
export default adminRouter;