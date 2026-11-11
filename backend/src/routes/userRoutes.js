import { Router } from 'express'; import { listUsers } from '../controllers/userController.js'; import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js'; import { asyncHandler } from '../utils/asyncHandler.js';
const router = Router(); router.get('/', authMiddleware, adminMiddleware, asyncHandler(listUsers)); export default router;
