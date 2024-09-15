import { z } from 'zod';

export const validationSchema = z
  .object({
    full_name: z.string().min(2, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    role: z.string({ message: 'Role is required' }).min(1, 'Role is required'),
    store: z.optional(z.string()),
    phone: z.optional(z.string()),
    note: z.optional(z.string()),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    _id: z.optional(z.string()),
    createdAt: z.optional(z.union([z.date(), z.string()])),
    updatedAt: z.optional(z.union([z.date(), z.string()])),
    __v: z.optional(z.number()),
  })
  .refine(
    data => {
      if (['cashier', 'manager'].includes(data.role)) {
        return !!data.store;
      }
      return true;
    },
    {
      message: 'Store is required for cashier or manager roles',
      path: ['store'],
    },
  );
export type UserDataTypes = z.infer<typeof validationSchema>;
