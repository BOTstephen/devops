import Attendance from '../models/Attendance.js';
import { ok, fail } from '../utils/apiResponse.js';
import { uploadToS3, deleteFile, generateDownloadUrl } from '../services/s3Service.js';

const todayKey = () => new Date().toISOString().slice(0, 10);
const withUrl = async (record) => { const item = record.toObject ? record.toObject() : record; if (item.image?.key) item.image.url = await generateDownloadUrl(item.image.key).catch(() => null); return item; };

export const checkIn = async (req, res) => {
  if (!req.file) return fail(res, 'A check-in image is required', 422);
  if (!['image/png', 'image/jpeg'].includes(req.file.mimetype)) return fail(res, 'Only JPG and PNG images are allowed for attendance', 422);
  const dateKey = todayKey();
  const existing = await Attendance.findOne({ user: req.user._id, dateKey });
  if (existing) return fail(res, 'You have already checked in today', 409);
  const image = await uploadToS3(`attendance/${req.user._id}`, req.file);
  const attendance = await Attendance.create({ user: req.user._id, dateKey, checkInAt: new Date(), image });
  return ok(res, await withUrl(attendance), 'Attendance checked in successfully', 201);
};

export const checkOut = async (req, res) => {
  const attendance = await Attendance.findOne({ user: req.user._id, dateKey: todayKey() });
  if (!attendance) return fail(res, 'Check in before checking out', 400);
  if (attendance.checkOutAt) return fail(res, 'You have already checked out today', 409);
  attendance.checkOutAt = new Date(); attendance.status = 'completed'; await attendance.save();
  return ok(res, await withUrl(attendance), 'Attendance checked out successfully');
};

export const myAttendance = async (req, res) => { const rows = await Attendance.find({ user: req.user._id }).sort({ dateKey: -1 }).limit(60); return ok(res, await Promise.all(rows.map(withUrl))); };
export const allAttendance = async (req, res) => { const filter = req.query.date ? { dateKey: req.query.date } : {}; const rows = await Attendance.find(filter).populate('user', 'name email').sort({ dateKey: -1, checkInAt: -1 }).limit(200); return ok(res, await Promise.all(rows.map(withUrl))); };
