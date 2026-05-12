import { z } from 'zod';

export const parentLoginSchema = z.object({
  mobileNumber: z.string().min(10, 'Invalid mobile number'),

  password: z.string().min(1, 'Password is required'),
});

