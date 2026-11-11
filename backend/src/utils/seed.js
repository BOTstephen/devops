import 'dotenv/config'; import mongoose from 'mongoose'; import bcrypt from 'bcryptjs'; import User from '../models/User.js'; import Task from '../models/Task.js'; import { connectDatabase } from '../config/database.js';
await connectDatabase(); await Task.deleteMany({}); 
await User.deleteMany({}); 
const password = await bcrypt.hash('DevOnly123!', 12); 
const [admin, alice, bob] = await User.create([
    { name: 'Admin User', email: 'admin@example.com', password, role: 'admin' }, 
    { name: 'Alice Employee', email: 'alice@example.com', password, role: 'employee' }, 
    { name: 'Bob Employee', email: 'bob@example.com', password, role: 'employee' }]); 
    await Task.create([
        { title: 'Set up deployment pipeline', description: 'Prepare the first CI pipeline.', 
            assignedTo: alice._id, createdBy: admin._id, priority: 'high', status: 'in-progress' },
             { title: 'Review service logs', description: 'Check the latest application logs.', assignedTo: bob._id, createdBy: admin._id, priority: 'medium' }, 
             { title: 'Update runbook', description: 'Document the local development workflow.', assignedTo: alice._id, createdBy: alice._id, priority: 'low', status: 'completed' }]); 
             console.log('Seed complete. Development password: DevOnly123!'); await mongoose.disconnect();
