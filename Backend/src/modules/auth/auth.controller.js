import SuperAdmin from '../superadmin/superadmin.model.js';
import User from '../user/user.model.js';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Try to find in SuperAdmin table (Keep existing logic)
    const superAdmin = await SuperAdmin.findOne({ where: { email } });
    if (superAdmin && (await superAdmin.comparePassword(password))) {
      const token = jwt.sign(
        { id: superAdmin.id, email: superAdmin.email, role: 'superadmin' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return res.status(200).json({
        success: true,
        token,
        role: 'superadmin',
        admin: { id: superAdmin.id, username: superAdmin.username, email: superAdmin.email },
        redirect: '/superadmin/dashboard'
      });
    }

    // 2. Try to find in Users table (School Admin support)
    const user = await User.findOne({ where: { email } });
    if (user && (await user.comparePassword(password))) {
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, schoolId: user.schoolId },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return res.status(200).json({
        success: true,
        token,
        role: user.role,
        schoolId: user.schoolId,
        user: { id: user.id, email: user.email, role: user.role, schoolId: user.schoolId },
        redirect: user.schoolId ? `/${user.role}/dashboard` : '/school-setup'
      });
    }

    return res.status(401).json({ success: false, message: "Invalid email or password" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
