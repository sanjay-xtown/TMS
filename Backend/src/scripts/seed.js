import { hashPassword } from '../shared/auth/bcrypt.js';
import Admin from '../modules/auth/admin.model.js';
import { connectDB } from '../config/db.js';

const seedAdmins = async () => {
  try {
    await connectDB();

    const hashedPassword = await hashPassword('password123');

    // Create SuperAdmin
    await Admin.create({
      name: 'Super Admin',
      email: 'superadmin@example.com',
      password: hashedPassword,
      role: 'superadmin',
    });

    // Create SchoolAdmin
    await Admin.create({
      name: 'School Admin',
      email: 'schooladmin@example.com',
      password: hashedPassword,
      role: 'school_admin',
      schoolId: '11111111-1111-1111-1111-111111111111', // Dummy UUID
    });

    console.log('✅ Demo Admins created successfully!');
    console.log('SuperAdmin: superadmin@example.com / password123');
    console.log('SchoolAdmin: schooladmin@example.com / password123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admins:', error.message);
    process.exit(1);
  }
};

seedAdmins();
