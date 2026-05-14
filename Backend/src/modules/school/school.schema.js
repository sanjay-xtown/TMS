import { z } from 'zod';

export const createSchoolSchema = z.object({
  schoolName: z.string().min(1, 'School name is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email'),
  principalName: z.string().min(1, 'Principal name is required'),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  adminName: z.string().optional(),
  adminEmail: z.string().email().optional(),
  adminPassword: z.string().min(6).optional(),
});

export const updateSchoolSchema = createSchoolSchema.partial();
