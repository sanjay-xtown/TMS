import { z } from 'zod';

export const createBusSchema = z.object({
  busRegisterNumber: z.string().min(1, 'Bus registration number is required'),
  busNumber: z.string().min(1, 'Bus number is required'),
  capacity: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().min(1).optional().default(40)),
  routeName: z.string().optional().default('Main Route'),
  schoolId: z.string().uuid('Invalid school ID'),
  driverName: z.string().optional().nullable(),
  driverMobileNumber: z.string().optional().nullable(),
  gpsDeviceId: z.string().optional().nullable(),
  gpsProvider: z.preprocess((val) => typeof val === 'string' ? val.toUpperCase() : val, z.enum(['TRACCAR', 'SIMULATED', 'STANDARD', 'ENTERPRISE']).optional().default('SIMULATED')),
  deviceIdentifier: z.string().optional().nullable(),
  trackingStatus: z.preprocess((val) => typeof val === 'string' ? val.toUpperCase() : val, z.enum(['ACTIVE', 'OFFLINE', 'INACTIVE', 'SCHOOL_HOURS_ONLY']).optional().default('INACTIVE')),
  status: z.preprocess((val) => typeof val === 'string' ? val.toUpperCase() : val, z.enum(['ACTIVE', 'INACTIVE']).optional().default('ACTIVE')),
  morningStartTime: z.string().optional().nullable(),
  eveningStartTime: z.string().optional().nullable(),
});

export const updateBusSchema = createBusSchema.partial();
