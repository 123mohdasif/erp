import express from 'express';
import { uploadResult, updateResultByRollNumber, deleteResultByRollNumber, getResult, getAllResultsController } from '../controllers/resultController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Admin routes
router.post('/', protect, admin, uploadResult);
router.put('/:rollnumber', protect, admin, updateResultByRollNumber);
router.delete('/:rollnumber', protect, admin, deleteResultByRollNumber);
router.get('/all', protect, admin, getAllResultsController);

// Student/Admin route
router.post('/view', protect, getResult);

export default router;
