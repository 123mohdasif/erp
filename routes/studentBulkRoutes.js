import express from 'express';
import { uploadStudentsFromExcel } from '../controllers/studentBulkController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Only admin can access
router.post(
  '/upload',
  protect,
  authorizeRoles('admin'),
  upload.single('file'),
  uploadStudentsFromExcel
);

export default router;
