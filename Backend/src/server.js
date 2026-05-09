import http from 'http';
import app from './app.js';
import sequelize, { connectDB } from './config/db.js';
import { initModels } from './models/initmodels.js';
import { initSocket } from './shared/socket/socket.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Initialize Models and Associations
  initModels();

  // Sync Database Models (Creates tables if they don't exist)
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized successfully.');
  } catch (error) {
    console.error('❌ Error synchronizing database:', error.message);
  }

  // Start Server
  server.listen(PORT, () => {
    console.log(`🚀 Server & Socket.io running on port ${PORT} in ${process.env.NODE_ENV} mode.`);
  });
};

startServer();
