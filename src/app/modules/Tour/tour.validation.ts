import { z } from 'zod';

export const createTourZodSchema = z.object({
  title: z.string({ error: 'Title is required' }).min(3).max(200),
  description: z.string().optional(),
  destination: z.string().optional(),
  itinerary: z.string().optional(),
  fee: z.coerce.number({ message: 'Fee is required' }).nonnegative(),
  category: z.string().optional(),
  duration: z.coerce.number({ message: 'Duration is required' }).positive(),
  meetingPoint: z.string().optional(),
  maxGroupSize: z.coerce.number().optional(),
  guide: z.string().optional(),
  status: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export const updateTourZodSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().optional(),
  destination: z.string().optional(),
  itinerary: z.string().optional(),
  fee: z.coerce.number().nonnegative().optional(),
  category: z.string().optional(),
  duration: z.coerce.number().positive().optional(),
  meetingPoint: z.string().optional(),
  maxGroupSize: z.coerce.number().optional(),
  status: z.string().optional(),
  images: z.array(z.string()).optional(),
});
