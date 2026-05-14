import * as authService from './auth.service.js';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['superadmin', 'school_admin']),
  schoolId: z.string().uuid().optional(),
});

export const login = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const data = await authService.loginAdmin(email, password);
    res.status(200).json({
      status: 'success',
      ...data,
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const adminData = registerSchema.parse(req.body);
    const admin = await authService.registerAdmin(adminData);
    res.status(201).json({
      status: 'success',
      data: admin,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await authService.getAllAdmins();
    res.status(200).json({
      status: 'success',
      data: admins,
    });
  } catch (error) {
    next(error);
  }
};
