import SuperAdmin from './superadmin/superadmin.model.js';
import SchoolAdmin from './schooladmin/schooladmin.model.js';


import jwt from 'jsonwebtoken';


export const loginAdmin = async (email, password) => {
  let user = null;
  let role = null;

  // 1. Check SuperAdmin table
  user = await SuperAdmin.findOne({ where: { email } });
  if (user) {
    role = 'superadmin';
  } else {
    // 2. If not found, check SchoolAdmin table
    user = await SchoolAdmin.findOne({ where: { email } });
    if (user) {
      role = 'schooladmin';
    }
  }

  // 3. Compare password
  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Invalid email or password');
  }

  // 4. Generate JWT token
  const payload = {
    id: user.id,
    role: role,
    email: user.email,
    schoolId: user.schoolId || null
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });

  // 5. Return success response data
  const userData = {
    id: user.id,
    role: role,
    email: user.email,
    ...(user.schoolId && { schoolId: user.schoolId })
  };

  return { user: userData, token };
};
