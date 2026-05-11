import app from "./app.js";
import { connectDB, sequelize } from "./config/db.js";
import { initModels } from "./models/initModels.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  initModels();
  
  try {
    await sequelize.sync({ alter: true });
    console.log("✅ Database synced successfully (alter: true)");
  } catch (error) {
    console.error("❌ Database sync failed:", error.message);
  }
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`✅ PostgreSQL connected successfully`);
  });
};


startServer();
