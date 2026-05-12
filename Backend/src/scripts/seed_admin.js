
import sequelize from "../config/db.js";
import SuperAdmin from "../modules/auth/superadmin/superadmin.model.js";


const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected for seeding...");

    // Sync models (This will create the tables if they don't exist)
    await sequelize.sync();

    const email = "admin@gmail.com";
    const password = "admin";

    const exists = await SuperAdmin.findOne({ where: { email } });

    if (exists) {
      console.log(`Admin already exists with email: ${email}`);
    } else {
      await SuperAdmin.create({
        username: "SuperAdmin",
        email: email,
        password: password, // This will be hashed by the model hook
      });
      console.log("✅ SuperAdmin created successfully!");
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seed();
