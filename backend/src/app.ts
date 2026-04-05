import 'reflect-metadata';
import express  from 'express';
import cors     from 'cors';
import dotenv   from 'dotenv';
import fs       from 'fs';
import path     from 'path';

import { connectDB }    from './config/database';
import routes           from './routes/index';
import morgan           from 'morgan';
import { notFoundHandler, globalErrorHandler } from './middleware/error.middleware';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middlewares ──────────────────────────────────────
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ───────────────────────────────────────────
app.use('/api', routes);

// ── Health Check ─────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// ── 404 ──────────────────────────────────────────────
app.use(notFoundHandler);

// ── Global Error Handler (must be last) ──────────────
app.use(globalErrorHandler);

// ── Start Server ─────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}).catch((err) => {
  console.error('❌ Failed to connect DB and start server:', err);
  process.exit(1);
});

// ── Process-level Guards (app should NEVER crash silently) ──

// Unhandled promise rejections — async errors not caught
process.on('unhandledRejection', (reason: any) => {
  console.error('🔥 Unhandled Promise Rejection:');
  console.error(reason);
  // Give server time to finish pending requests then exit
  process.exit(1);
});

// Uncaught exceptions — sync errors not caught
process.on('uncaughtException', (err: Error) => {
  console.error('💥 Uncaught Exception:');
  console.error(err.message);
  console.error(err.stack);
  process.exit(1);
});

// Graceful shutdown on SIGTERM (e.g. when deployed / killed)
process.on('SIGTERM', () => {
  console.log('⚠️  SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

export default app;