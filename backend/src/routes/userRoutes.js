import express from 'express';
import { getMyParticipations, participateInEvent } from '../controller/registrationController.js';
import { authenticatedUser } from './../middleware/authMiddleware.js';


const userParticipatedEvents = express.Router();

userParticipatedEvents.post('/:eventId/participate',authenticatedUser, participateInEvent);
// Route to get user's participated events
userParticipatedEvents.get('/my-participations', authenticatedUser,getMyParticipations);

export default userParticipatedEvents