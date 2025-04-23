import express from 'express';

import { isAdmin } from '../middleware/authMiddleware.js';
import multer from 'multer';
import { deleteReport, getReports, uploadReport } from '../controller/reportController.js';

const Reportrouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload Report
Reportrouter.post('/upload', isAdmin, upload.single('file'), uploadReport);

// Get All Reports
Reportrouter.get('/', isAdmin, getReports);

// Delete Report
Reportrouter.delete('/:id', isAdmin, deleteReport);

export default Reportrouter;