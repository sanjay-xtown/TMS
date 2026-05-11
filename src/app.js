import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import schoolRoutes from "./modules/school/school.routes.js";
import busRoutes from "./modules/bus/bus.routes.js";
import trackingRoutes from "./modules/tracking/tracking.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api", dashboardRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("🚀 School Bus Tracking API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

export default app;
