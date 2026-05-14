import dotenv from 'dotenv';
dotenv.config();
import app from "./app.js";
import { connectDB, sequelize } from "./config/db.js";
import { initModels } from "./models/initModels.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    initModels();
    
    // Attempt database synchronization
    await sequelize.sync();
    console.log("✅ Database synced successfully");

    app.listen(PORT, () => {
      const startupLog = `[${new Date().toISOString()}] 🚀 Server running on port ${PORT}\n`;
      console.log(startupLog);
      import('fs').then(fs => {
        fs.appendFileSync('startup.log', startupLog);
      });
      console.log(`✅ PostgreSQL connected successfully`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
