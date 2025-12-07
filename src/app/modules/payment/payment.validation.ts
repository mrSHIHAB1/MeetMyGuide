import { z } from 'zod';

export const createCheckoutSessionZodSchema = z.object({
  bookingId: z.string({ error: 'Booking ID is required' }),
  tourId: z.string({ error: 'Tour ID is required' }),
  amount: z.number({error: 'Amount is required' }).positive(),
  currency: z.string().optional(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

export const webhookZodSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.object({
    object: z.any(),
  }),
});
