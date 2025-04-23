import express from 'express';
import { authenticatedUser, isAdmin } from '../middleware/authMiddleware.js';
import { createEvent, deleteEvent, getAllEvents, getEventById, profile, updateEvent } from '../controller/eventController.js';
import multer from 'multer';
import { getEventParticipants, markAttendance } from '../controller/registrationController.js';


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const eventRoutes = express.Router();

// Route for creating an event with file upload and authentication
eventRoutes.post('/user/create/event',isAdmin, upload.single('poster'), createEvent);
eventRoutes.get('/user/getAllEvents', getAllEvents);
// eventRoutes.delete("/admin/deleteEvent/:eventId", isAdmin, deleteEvent);
eventRoutes.get('/:eventId/participants', getEventParticipants);
eventRoutes.get('/:eventId', getEventById);
eventRoutes.put('/admin/updateEvent/:eventId', isAdmin,upload.single('poster'), updateEvent);
eventRoutes.put("/:eventId/attendance", markAttendance);
export default eventRoutes;