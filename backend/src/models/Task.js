import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema({ originalName: String, key: String, url: String, contentType: String, size: Number }, { _id: false });
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, default: '', maxlength: 5000 },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: { type: String, enum: ['pending', 'in-progress', 'completed', 'cancelled'], default: 'pending', index: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium', index: true },
  dueDate: { type: Date },
  attachment: attachmentSchema
}, { timestamps: true });
taskSchema.index({ createdAt: -1 });
taskSchema.index({ title: 'text', description: 'text' });
export default mongoose.model('Task', taskSchema);
