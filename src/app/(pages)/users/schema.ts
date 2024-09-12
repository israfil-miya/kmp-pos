import { z } from 'zod';

export const validationSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  role: z.string().min(1, 'Role is required'),
  store: z.optional(z.string()),
  phone: z.optional(z.string()),
  note: z.optional(z.string()),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  _id: z.optional(z.string()),
  createdAt: z.optional(z.union([z.date(), z.string()])),
  updatedAt: z.optional(z.union([z.date(), z.string()])),
  __v: z.optional(z.number()),
});

export type UsersDataTypes = z.infer<typeof validationSchema>;
