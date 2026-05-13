import app from './app.js';
import sequelize from './config/db.js';

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(async () => {
  console.log('✅ Database Synchronized');
  
  // Auto-seed SuperAdmin if not exists
  const { SuperAdmin } = await import('./modules/superadmin/superadmin.model.js');
  const adminExists = await SuperAdmin.findOne({ where: { email: 'admin@example.com' } });
  if (!adminExists) {
    await SuperAdmin.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'password123'
    });
    console.log('👤 Default SuperAdmin created: admin@example.com / password123');
  }

  // Auto-seed SchoolAdmin if not exists
  const { User } = await import('./modules/user/user.model.js');
  const schoolAdminExists = await User.findOne({ where: { email: 'admin@gmail.com' } });
  if (!schoolAdminExists) {
    await User.create({
      email: 'admin@gmail.com',
      password: 'admin123',
      role: 'schooladmin'
    });
    console.log('👤 Default SchoolAdmin created: admin@gmail.com / admin123');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('❌ Database Sync Failed:', err);
});
