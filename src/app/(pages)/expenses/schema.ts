import { z } from 'zod';

export const validationSchema = z.object({
  reason: z.string().min(1, 'Reason is required'),
  amount: z.optional(z.coerce.number()).default(0),
  category: z.optional(z.string()),
  full_name: z.optional(z.string()),
  store_name: z.optional(z.string()).default(''),
  _id: z.optional(z.string()),
  createdAt: z.optional(z.union([z.date(), z.string()])),
  updatedAt: z.optional(z.union([z.date(), z.string()])),
  __v: z.optional(z.number()),
});

export type ExpenseDataTypes = z.infer<typeof validationSchema>;

export interface RegexQuery {
  $regex: string;
  $options: string;
}

export interface Query {
  reason?: RegexQuery;
  category?: RegexQuery;
  full_name?: RegexQuery;
  store_name?: RegexQuery;
}

export type RegexFields = Extract<
  keyof Query,
  'reason' | 'category' | 'full_name' | 'store_name'
>;
