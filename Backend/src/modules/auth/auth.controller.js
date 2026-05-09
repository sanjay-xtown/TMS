import * as authService from './auth.service.js';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
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
