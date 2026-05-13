import SuperAdmin from './superadmin.model.js';
import jwt from 'jsonwebtoken';

class SuperAdminService {
  async register(data) {
    return await SuperAdmin.create(data);
  }

  async login(email, password) {
    const admin = await SuperAdmin.findOne({ where: { email } });
    if (!admin || !(await admin.comparePassword(password))) {
      throw new Error("Invalid credentials");
    }
    
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: 'superadmin' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return { token, admin: { id: admin.id, username: admin.username, email: admin.email } };
  }

  async getProfile(id) {
    return await SuperAdmin.findByPk(id, { attributes: { exclude: ['password'] } });
  }
}

export default new SuperAdminService();
