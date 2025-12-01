import { z } from 'zod';

export const createBookingZodSchema = z.object({
  traveler: z.string({ error: 'Traveler ID is required' }),
  guide: z.string({ error: 'Guide ID is required' }),
  tour: z.string({ error: 'Tour ID is required' }),
  requestedDate: z.string({ error: 'Requested date is required' }),
  requestedTime: z.string().optional(),
  numberOfPeople: z.number().optional(),
  specialRequests: z.string().optional(),
});

export const updateBookingZodSchema = z.object({
  requestedDate: z.string().optional(),
  requestedTime: z.string().optional(),
  numberOfPeople: z.number().optional(),
  specialRequests: z.string().optional(),
});

export const statusUpdateZodSchema = z.object({
  status: z.enum(['CONFIRMED', 'CANCELLED']),
});
