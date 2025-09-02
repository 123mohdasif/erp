// backend/routes/teacherRoutes.js
import express from 'express';
import { registerTeacher, loginTeacher } from '../controllers/teacherController.js';
import { getProfile,updateProfile } from '../controllers/teacherController.js';
import { protect,authorizeRoles } from './../middleware/authMiddleware.js';
import { getTeachers } from '../controllers/teacherController.js';
const router = express.Router();

// Register teacher
router.post('/register', registerTeacher);

// Login teacher
router.post('/login', loginTeacher);

//Profile
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/', protect, authorizeRoles('admin'), getTeachers);// Admin: view all teachers





export default router;
