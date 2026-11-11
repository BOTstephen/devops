import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ok, fail } from '../utils/apiResponse.js';
const tokenFor = (user) => jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
const safe = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive, createdAt: user.createdAt });
export const register = async (req, res) => { const { name, email, password } = req.body; if (!name || !email || !password || password.length < 8) return fail(res, 'Name, email and a password of at least 8 characters are required', 422); const exists = await User.findOne({ email }); if (exists) return fail(res, 'Email is already registered', 409); const user = await User.create({ name, email, password: await bcrypt.hash(password, 12), role: 'employee' }); return ok(res, { user: safe(user), token: tokenFor(user) }, 'Registration successful', 201); };
export const login = async (req, res) => { const { email, password } = req.body; const user = await User.findOne({ email }).select('+password'); if (!user || !(await bcrypt.compare(password || '', user.password))) return fail(res, 'Invalid email or password', 401); if (!user.isActive) return fail(res, 'Account is inactive', 403); return ok(res, { user: safe(user), token: tokenFor(user) }, 'Login successful'); };
export const me = async (req, res) => ok(res, { user: safe(req.user) });
