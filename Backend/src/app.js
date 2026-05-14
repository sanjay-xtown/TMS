import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorMiddleware } from './shared/middleware/errorMiddleware.js';

// Import Routes
import parentRoutes from './modules/parent/parent.routes.js';
import studentRoutes from './modules/student/student.routes.js';
import trackingRoutes from './modules/tracking/tracking.routes.js';
import transferRoutes from './modules/transfer/transfer.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import schoolRoutes from './modules/school/school.routes.js';
import busRoutes from './modules/bus/bus.routes.js';
import busStatusRoutes from './modules/busStatus/busStatus.routes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Request Logger for Debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

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
app.use('/api/schools', schoolRoutes);
app.use('/api/bus', busRoutes);
app.use('/api/bus-status', busStatusRoutes);

// Global Error Handler
app.use(errorMiddleware);

export default app;
