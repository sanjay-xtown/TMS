import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import superAdminRoutes from './modules/superadmin/superadmin.routes.js';
import schoolAdminRoutes from './modules/schooladmin/schooladmin.routes.js';
import settingsRoutes from './modules/settings/settings.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import schoolRoutes from './modules/school/school.routes.js';
import busRoutes from './modules/bus/bus.routes.js';
import studentRoutes from './modules/student/student.routes.js';
import parentRoutes from './modules/parent/parent.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/schooladmin', schoolAdminRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/school', schoolRoutes);
app.use('/api/bus', busRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/parent', parentRoutes);

// Base Route
app.get('/', (req, res) => {
  res.json({ message: "Bus Tracking System API" });
});

export default app;
