import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorMiddleware } from './shared/Middleware/errorMiddleware.js';

// Import Routes
import parentRoutes from './modules/parent/parent.routes.js';
import studentRoutes from './modules/student/student.routes.js';
import trackingRoutes from './modules/tracking/tracking.routes.js';
import transferRoutes from './modules/transfer/transfer.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import authRoutes from './modules/auth/auth.routes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base Route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to School Bus Tracking System API',
    version: '1.0.0'
  });
});

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/transfer', transferRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Global Error Handler
app.use(errorMiddleware);

export default app;
