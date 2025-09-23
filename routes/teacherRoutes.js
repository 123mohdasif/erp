import express from 'express';
import { 
    registerTeacher, 
    loginTeacher, 
    getProfile, 
    updateProfile, 
    getTeachers 
} from '../controllers/teacherController.js';

// --- THE CHANGE IS HERE ---
// 1. Import the single, unified middleware function.
import { protectAndAuthorize } from './../middleware/ass.js';

const router = express.Router();

// --- Public Routes (No changes) ---
// These routes do not require a user to be logged in.
router.post('/register', registerTeacher);
router.post('/login', loginTeacher);


// --- Protected Routes (Updated) ---

// Profile routes: Accessible by any authenticated user (student, teacher, admin).
// We call protectAndAuthorize() with no arguments.
router.get('/profile', protectAndAuthorize(), getProfile);
router.put('/profile', protectAndAuthorize(), updateProfile);

// Admin-only route: View all teachers.
// We pass the required role 'admin' to the middleware.
router.get('/', protectAndAuthorize('admin'), getTeachers);


export default router;
