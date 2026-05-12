import { hashPassword } from '../shared/auth/bcrypt.js';
import Admin from '../modules/auth/admin.model.js';
import School from '../modules/school/school.model.js';
import Bus from '../modules/bus/bus.model.js';
import BusLiveLocation from '../modules/tracking/tracking.model.js';
import sequelize, { connectDB } from '../config/db.js';
import { initModels } from '../models/initModels.js';

const seedDatabase = async () => {
  try {
    await connectDB();
    initModels();
    await sequelize.sync({ force: true });
    console.log("✅ Database synced (force: true)");

    const hashedPassword = await hashPassword('password123');

    // 1. Create SuperAdmin
    await Admin.create({
      name: 'Super Admin',
      email: 'superadmin@example.com',
      password: hashedPassword,
      role: 'superadmin',
    });

    // 2. Create School
    const school = await School.create({
      id: '11111111-1111-1111-1111-111111111111',
      schoolName: "Coimbatore Public School",
      address: "Saravanampatti, Coimbatore",
      phone: "0422-1234567",
      email: "info@cpschool.com",
      principalName: "Dr. Rajesh",
      latitude: 11.0760,
      longitude: 76.9930
    });

    // 3. Create Bus
    const bus = await Bus.create({
      id: '22222222-2222-2222-2222-222222222222',
      busRegisterNumber: "TN37XY9999",
      busNumber: "BUS-10",
      capacity: 40,
      routeName: "Peelamedu to School",
      schoolId: school.id,
      driverName: "Murugan",
      driverMobileNumber: "9843212345",
      gpsDeviceId: "GPS_DEVICE_001",
      status: "ACTIVE"
    });

    // 4. Create Initial Live Location
    await BusLiveLocation.create({
      busId: bus.id,
      gpsDeviceId: bus.gpsDeviceId,
      latitude: 11.0168,
      longitude: 76.9558,
      speed: 0,
      timestamp: new Date()
    });

    console.log('✅ Realistic Initial Data created successfully!');
    console.log('Admin: superadmin@example.com / password123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
