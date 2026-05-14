import Admin from './admin.model.js';
import { School } from '../school/school.model.js';
import { hashPassword, comparePassword } from '../../shared/auth/bcrypt.js';
import { generateToken } from '../../shared/auth/jwt.js';
import { AppError } from '../../shared/errorHandling/errorHandler.js';

export const loginAdmin = async (email, password) => {
  const admin = await Admin.findOne({ where: { email } });
  
  if (!admin || !(await comparePassword(password, admin.password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken({ 
    id: admin.id, 
    role: admin.role, 
    email: admin.email,
    schoolId: admin.schoolId 
  });

  const { password: _, ...adminData } = admin.toJSON();
  return { admin: adminData, token };
};

export const registerAdmin = async (adminData) => {
  const existingAdmin = await Admin.findOne({ where: { email: adminData.email } });
  if (existingAdmin) {
    throw new AppError('Admin with this email already exists', 400);
  }

  const hashedPassword = await hashPassword(adminData.password);
  const admin = await Admin.create({
    ...adminData,
    password: hashedPassword,
  });

  const { password: _, ...adminResult } = admin.toJSON();
  return adminResult;
};

export const getAllAdmins = async () => {
  return await Admin.findAll({
    attributes: { exclude: ['password'] },
    include: [
      {
        model: School,
        as: 'school',
        attributes: ['schoolName']
      }
    ]
  });
};
