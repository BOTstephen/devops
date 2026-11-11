import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { checkIn, checkOut, myAttendance, allAttendance } from '../controllers/attendanceController.js';

const router = Router();
router.use(authMiddleware);
router.post('/check-in', upload.single('image'), asyncHandler(checkIn));
router.post('/check-out', asyncHandler(checkOut));
router.get('/me', asyncHandler(myAttendance));
router.get('/', adminMiddleware, asyncHandler(allAttendance));
export default router;
