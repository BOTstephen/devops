import mongoose from 'mongoose';

export const connectDatabase = async () => {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required');
  const options = process.env.MONGODB_USERNAME && process.env.MONGODB_PASSWORD
    ? { auth: { username: process.env.MONGODB_USERNAME, password: process.env.MONGODB_PASSWORD } }
    : {};
  await mongoose.connect(process.env.MONGODB_URI, options);
  console.log('MongoDB connected');
};
