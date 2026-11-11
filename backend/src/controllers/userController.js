import User from '../models/User.js';
import { ok } from '../utils/apiResponse.js';
export const listUsers = async (req, res) => ok(res, { users: await User.find({ role: 'employee' }).select('-password').sort({ name: 1 }) });
