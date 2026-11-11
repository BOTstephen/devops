import 'dotenv/config'; import app from './app.js'; import { connectDatabase } from './config/database.js';
const port = process.env.PORT || 5000; let server;
try { await connectDatabase(); server = app.listen(port, () => console.log(`API listening on port ${port}`)); } catch (error) { console.error('Startup failed:', error.message); process.exit(1); }
const shutdown = async (signal) => { console.log(`${signal} received`); if (server) server.close(); process.exit(0); }; process.on('SIGTERM', () => shutdown('SIGTERM')); process.on('SIGINT', () => shutdown('SIGINT'));
