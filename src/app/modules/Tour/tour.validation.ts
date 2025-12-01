import { z } from 'zod';

export const createTourZodSchema = z.object({
  title: z.string({ error: 'Title is required' }).min(3).max(200),
  description: z.string().optional(),
  itinerary: z.string().optional(),
  fee: z.number({ message: 'Fee is required' }).nonnegative(),
  duration: z.number({ message: 'Duration is required' }).positive(),
  meetingPoint: z.string().optional(),
  maxGroupSize: z.number().optional(),
  images: z.array(z.string()).optional(),
});

export const updateTourZodSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().optional(),
  itinerary: z.string().optional(),
  fee: z.number().nonnegative().optional(),
  duration: z.number().positive().optional(),
  meetingPoint: z.string().optional(),
  maxGroupSize: z.number().optional(),
  images: z.array(z.string()).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});
