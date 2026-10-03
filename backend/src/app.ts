import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app: Application = express();

// CORS configuration - supports FRONTEND_URL, comma-separated origins, Vercel domains, and local dev
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, curl, Postman, health check probes)
    if (!origin) return callback(null, true);

    const isExplicitlyAllowed = allowedOrigins.includes(origin) || allowedOrigins.includes('*');
    const isVercelDomain = origin.endsWith('.vercel.app');
    const isLocalhost = origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:');

    if (isExplicitlyAllowed || isVercelDomain || isLocalhost) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files (test papers, docs)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// API Routes
app.use('/api', routes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
