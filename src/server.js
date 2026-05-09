import app from "./app.js";
import { connectDB, sequelize } from "./config/db.js";
import { initModels } from "./models/initModel.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();
  initModels();
  
  // Sync Models
  // alter: true updates tables to match models without dropping data.
  // In production, migrations (Sequelize CLI) are preferred for safer version control and audit trails.
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
