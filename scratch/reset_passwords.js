import bcrypt from "bcrypt";
import { User } from "../src/modules/user/user.model.js";
import { connectDB, sequelize } from "../src/config/db.js";

const resetPasswords = async () => {
  await connectDB();
  
  const hashedPassword = await bcrypt.hash("password123", 10);
  
  await User.update(
    { password: hashedPassword },
    { where: {} } // Reset all users for testing
  );
  
  console.log("✅ All user passwords reset to: password123");
  process.exit();
};

resetPasswords();
