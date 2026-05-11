import { User } from "./src/modules/user/user.model.js";
import { connectDB, sequelize } from "./src/config/db.js";

const listUsers = async () => {
  await connectDB();
  const users = await User.findAll({ attributes: ["id", "email", "role"] });
  console.log("Registered Users:");
  console.table(users.map(u => u.toJSON()));
  process.exit();
};

listUsers();
