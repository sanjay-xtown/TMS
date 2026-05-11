import { z } from 'zod';

export const createBusSchema = z.object({
  busRegisterNumber: z.string().min(1, 'Bus registration number is required'),
  busNumber: z.string().min(1, 'Bus number is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  routeName: z.string().min(1, 'Route name is required'),
  schoolId: z.string().uuid('Invalid school ID'),
  driverName: z.string().optional().nullable(),
  driverMobileNumber: z.string().optional().nullable(),
  gpsDeviceId: z.string().min(1, 'GPS Device ID is required'),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional().default('ACTIVE'),
});

export const updateBusSchema = createBusSchema.partial();
