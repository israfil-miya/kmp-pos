import { z } from 'zod';

export const validationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  location: z.optional(z.string()),
  manager: z.optional(z.string()),
  phone: z.optional(z.string()),
  status: z
    .string(z.enum(['open', 'closed'], { message: 'Invalid status' }))
    .min(1, 'Status is required'),
  _id: z.optional(z.string()),
  createdAt: z.optional(z.union([z.date(), z.string()])),
  updatedAt: z.optional(z.union([z.date(), z.string()])),
  __v: z.optional(z.number()),
});

export type StoreDataTypes = z.infer<typeof validationSchema>;
