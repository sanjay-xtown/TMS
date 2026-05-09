import { z } from 'zod';

export const createStudentSchema = z.object({
  studentName: z.string().min(2, 'Student name is required'),
  class: z.string().min(1, 'Class is required'),
  section: z.string().min(1, 'Section is required'),
  gender: z.enum(['Male', 'Female', 'Other']),
  address: z.string().min(5, 'Address is required'),
  pickupPoint: z.string().min(2, 'Pickup point is required'),
  schoolId: z.string().uuid('Invalid school ID'),
  currentBusId: z.string().uuid('Invalid bus ID').optional(),

  // Nested Parent Details
  parent: z.object({
    parentName: z.string().min(2, 'Parent name is required'),
    mobileNumber: z.string().regex(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    address: z.string().min(5, 'Parent address is required')
  })
});

export const updateStudentSchema = createStudentSchema.partial();
