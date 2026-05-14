import { z } from 'zod';

export const createBusSchema = z.object({
  busRegisterNumber: z.string().min(1, 'Bus registration number is required'),
  busNumber: z.string().min(1, 'Bus number is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  routeName: z.string().min(1, 'Route name is required'),
  schoolId: z.string().uuid('Invalid school ID'),
  driverName: z.string().optional().nullable(),
  driverMobileNumber: z.string().optional().nullable(),
  gpsDeviceId: z.string().optional().nullable(),
  gpsProvider: z.enum(['TRACCAR', 'SIMULATED']).optional().default('SIMULATED'),
  deviceIdentifier: z.string().optional().nullable(),
  trackingStatus: z.enum(['ACTIVE', 'OFFLINE', 'INACTIVE', 'SCHOOL_HOURS_ONLY']).optional().default('INACTIVE'),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional().default('ACTIVE'),
  morningStartTime: z.string().optional().nullable(),
  eveningStartTime: z.string().optional().nullable(),
});

export const updateBusSchema = createBusSchema.partial();
