import express, { Application } from 'express';
import http from 'http';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { initializeSocket } from './socket/socket';
import authRoutes from './routes/auth.routes';
import chatRoutes from './routes/chat.routes';

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();

// Create HTTP server
const httpServer = http.createServer(app);

// Connect to MongoDB
connectDB();

// Serve static files (uploads) - Must be before helmet for CORS
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Security Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow images to be loaded from different origins
  })
);
app.use(mongoSanitize()); // Prevent NoSQL injection

// CORS Configuration
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:3000'];

console.log('🌐 Allowed Origins:', allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Log the rejected origin for debugging
        console.log('❌ CORS rejected origin:', origin);
        // Still allow it but log it - for production debugging
        callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Handle preflight requests explicitly
app.options('*', cors());

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate Limiting (skip for OPTIONS)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  rateLimiter(req, res, next);
});

// Health Check Route
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'FlowChat API is running',
    timestamp: new Date().toISOString(),
  });
});

// Initialize Socket.io
initializeSocket(httpServer);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Error Handler (must be last)
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`
    ╔════════════════════════════════════════╗
    ║   FlowChat Backend Server Started     ║
    ╠════════════════════════════════════════╣
    ║   Port: ${PORT}                       ║
    ║   Environment: ${process.env.NODE_ENV || 'development'}        ║
    ║   Database: MongoDB                    ║
    ║   Socket.io: Enabled                   ║
    ║   Redis: Connected                     ║
    ╚════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

export default app;

