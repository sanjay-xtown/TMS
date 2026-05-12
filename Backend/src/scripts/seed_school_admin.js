
import sequelize from "../config/db.js";
import School from "../modules/school/school.model.js";
import SchoolAdmin from "../modules/auth/schooladmin/schooladmin.model.js";


const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected for seeding School Admin...");

    // Sync models
    await sequelize.sync();

    // 1. Ensure a school exists
    let school = await School.findOne({ where: { schoolName: "Greenwood High" } });
    if (!school) {
      school = await School.create({
        schoolName: "Greenwood High",
        address: "123 Education Lane, City",
        phone: "1234567890",
        email: "contact@greenwood.com",
        principalName: "Dr. Smith",
        status: "APPROVED"
      });
      console.log("✅ Default School created!");
    }

    // 2. Create School Admin
    const email = "school@gmail.com";
    const password = "school";

    const exists = await SchoolAdmin.findOne({ where: { email } });

    if (exists) {
      console.log(`School Admin already exists with email: ${email}`);
    } else {
      await SchoolAdmin.create({
        username: "SchoolAdmin",
        email: email,
        password: password, // Hashed by model hook
        schoolId: school.id
      });
      console.log("✅ School Admin created successfully!");
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
      console.log(`Linked School: ${school.schoolName}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seed();
