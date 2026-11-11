import test, { before, after } from 'node:test'; import assert from 'node:assert/strict'; import request from 'supertest'; import { MongoMemoryServer } from 'mongodb-memory-server'; import mongoose from 'mongoose'; import bcrypt from 'bcryptjs'; import jwt from 'jsonwebtoken'; import app from '../src/app.js'; import User from '../src/models/User.js';
let mongo, token, user;
before(async()=>{process.env.JWT_SECRET='test-secret'; process.env.FRONTEND_URL='http://localhost:5173'; mongo=await MongoMemoryServer.create(); await mongoose.connect(mongo.getUri()); user=await User.create({name:'Test User',email:'test@example.com',password:await bcrypt.hash('Password123!',10),role:'employee'}); token=jwt.sign({id:user._id.toString(),role:user.role},process.env.JWT_SECRET);});
after(async()=>{await mongoose.disconnect(); await mongo.stop();});
test('health endpoint',async()=>{const r=await request(app).get('/health');assert.equal(r.status,200);assert.equal(r.body.success,true);});
test('registration',async()=>{const r=await request(app).post('/api/auth/register').send({name:'New User',email:'new@example.com',password:'Password123!'});assert.equal(r.status,201);assert.equal(r.body.data.user.role,'employee');});
test('login',async()=>{const r=await request(app).post('/api/auth/login').send({email:'test@example.com',password:'Password123!'});assert.equal(r.status,200);assert.ok(r.body.data.token);});
test('protected route rejects missing token',async()=>{const r=await request(app).get('/api/auth/me');assert.equal(r.status,401);});
test('task creation and retrieval',async()=>{const created=await request(app).post('/api/tasks').set('Authorization',`Bearer ${token}`).send({title:'Test task',assignedTo:user._id.toString(),priority:'high'});assert.equal(created.status,201);const got=await request(app).get(`/api/tasks/${created.body.data._id}`).set('Authorization',`Bearer ${token}`);assert.equal(got.status,200);assert.equal(got.body.data.title,'Test task');});




