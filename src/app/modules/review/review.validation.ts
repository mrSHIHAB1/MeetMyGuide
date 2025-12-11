import { z } from 'zod';

export const createReviewZodSchema = z.object({
  guideId: z.string({ error: 'Guide ID is required' }),
  reviewerId: z.string().optional(),
  touristId: z.string().optional(),
  tourId: z.string().optional(),
  rating: z.number({ error: 'Rating is required' }).min(1).max(5),
  comment: z.string().optional(),
});

export const updateReviewZodSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().optional(),
});
