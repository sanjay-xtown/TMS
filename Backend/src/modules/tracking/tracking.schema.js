import { z } from 'zod';

export const updateLocationSchema = z.object({
  busId: z.string().uuid('Invalid bus ID'),
  latitude: z.number(),
  longitude: z.number(),
  speed: z.number().min(0).optional(),
  status: z.enum([
    'inactive', 
    'morning_pickup', 
    'school_reached', 
    'evening_drop', 
    'trip_completed', 
    'private_use', 
    'maintenance', 
    'breakdown', 
    'holiday'
  ]).optional(),
});
