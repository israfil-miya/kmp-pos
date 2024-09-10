import { z } from 'zod';

export const validationSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  _id: z.optional(z.string()),
  createdAt: z.optional(z.date()),
  updatedAt: z.optional(z.date()),
  __v: z.optional(z.number()),
});

export type CategoryDataTypes = z.infer<typeof validationSchema>;
