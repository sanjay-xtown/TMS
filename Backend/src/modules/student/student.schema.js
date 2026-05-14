import { z } from 'zod';

export const createStudentSchema = z.object({
  studentName: z.string().min(2, 'Student name is required'),
  rollNo: z.string().min(1, 'Roll number is required'),
  class: z.string().min(1, 'Class is required'),
  section: z.string().min(1, 'Section is required'),
  gender: z.enum(['Male', 'Female', 'Other']).optional().default('Male'),
  address: z.string().optional().default('Not Provided'),
  pickupPoint: z.string().min(2, 'Pickup point is required'),
  schoolId: z.string().uuid('Invalid school ID').optional(),
  currentBusId: z.preprocess((val) => (val === '' ? null : val), z.string().uuid('Invalid bus ID').optional().nullable()),
  pickupLat: z.preprocess((val) => (val === '' ? null : val === null ? null : Number(val)), z.number().optional().nullable()),
  pickupLng: z.preprocess((val) => (val === '' ? null : val === null ? null : Number(val)), z.number().optional().nullable()),

  // Nested Parent Details
  parent: z.object({
    parentName: z.string().min(2, 'Parent name is required'),
    mobileNumber: z.string().regex(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
    email: z.string().email('Invalid email address'),
    password: z.string().optional(),
    address: z.string().optional().default('Not Provided')
  })
});

export const updateStudentSchema = createStudentSchema.partial();
