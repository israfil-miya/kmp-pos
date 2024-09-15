import { z } from 'zod';

export const validationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  company: z.optional(z.string()).default(''),
  reg_date: z.optional(z.string()).default(''),
  email: z.optional(z.string()).default(''),
  phone: z.optional(z.string()).default(''),
  address: z.optional(z.string()).default(''),
  _id: z.optional(z.string()),
  createdAt: z.optional(z.union([z.date(), z.string()])),
  updatedAt: z.optional(z.union([z.date(), z.string()])),
  __v: z.optional(z.number()),
});

export type SupplierDataTypes = z.infer<typeof validationSchema>;

export interface RegexQuery {
  $regex: string;
  $options: string;
}

export interface Query {
  name?: RegexQuery;
  company?: RegexQuery;
  email?: RegexQuery;
  phone?: RegexQuery;
  address?: RegexQuery;
}

export type RegexFields = Extract<
  keyof Query,
  'name' | 'company' | 'email' | 'phone' | 'address'
>;
