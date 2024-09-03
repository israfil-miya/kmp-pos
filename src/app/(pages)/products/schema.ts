import { z } from 'zod';

export const validationSchema = z.object({
  batch: z.string().length(8, 'Batch must be 8 characters long'),
  name: z.string().min(1, 'Name is required'),
  cost_price: z.number().min(1, 'Cost price must be greater than zero'),
  selling_price: z.number().min(1, 'Selling price must be greater than zero'),
  quantity: z.number().min(0, 'Quantity must be greater than or equal to zero'),
  supplier: z.array(z.string()).min(1, 'Supplier is required'),
  category: z.array(z.string()).min(1, 'Category is required'),
  store: z.array(z.string()).min(1, 'Store is required'),

  description: z.optional(z.string()),
  mft_date: z.optional(z.string()),
  exp_date: z.optional(z.string()),
  in_stock: z.optional(z.boolean()),
  _id: z.optional(z.string()),
  createdAt: z.optional(z.string()),
  updatedAt: z.optional(z.string()),
  __v: z.optional(z.number()),
});

export type ProductDataTypes = z.infer<typeof validationSchema>;
