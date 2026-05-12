import { z } from 'zod';

export const liveLocationSchema = z.object({
  gpsDeviceId: z.string().optional(),
  busId: z.string().uuid().optional(),
  latitude: z.number(),
  longitude: z.number(),
  speed: z.number().optional().default(0),
  status: z.string().optional(),
  timestamp: z.string().optional(), // Devices might send their own timestamp
});
