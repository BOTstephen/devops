import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { fail } from '../utils/apiResponse.js';

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null;
  if (!token) return fail(res, 'Authentication required', 401);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive) return fail(res, 'User is not active', 401);
    req.user = user; next();
  } catch { return fail(res, 'Invalid or expired token', 401); }
};
export const adminMiddleware = (req, res, next) => req.user?.role === 'admin' ? next() : fail(res, 'Admin access required', 403);
