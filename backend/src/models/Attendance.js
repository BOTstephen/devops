import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  dateKey: { type: String, required: true },
  checkInAt: { type: Date, required: true },
  checkOutAt: { type: Date },
  status: { type: String, enum: ['present', 'completed'], default: 'present' },
  image: { originalName: String, key: String, url: String, contentType: String, size: Number }
}, { timestamps: true });

attendanceSchema.index({ user: 1, dateKey: 1 }, { unique: true });
attendanceSchema.index({ dateKey: 1 });
export default mongoose.model('Attendance', attendanceSchema);
