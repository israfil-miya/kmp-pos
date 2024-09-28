import moment from 'moment-timezone';
import { z } from 'zod';

export const validationSchema = z.object({
  batch: z.string().length(8, 'Batch must be 8 characters long'),
  name: z.string().min(1, 'Name is required'),
  cost_price: z.coerce
    .number({ invalid_type_error: 'Cost price must be a number' })
    .gte(1, 'Cost price must be greater than zero'),
  selling_price: z.coerce
    .number({ invalid_type_error: 'Cost price must be a number' })
    .gte(1, 'Selling price must be greater than zero'),
  quantity: z.coerce
    .number({ invalid_type_error: 'Cost price must be a number' })
    .nonnegative('Quantity cannot be in negative'),
  supplier: z.array(z.string()).min(1, 'Supplier is required'),
  category: z.array(z.string()).min(1, 'Category is required'),
  store: z.array(z.string()).min(1, 'Store is required'),
  vat_rate: z
    .optional(
      z.coerce
        .number({ invalid_type_error: 'VAT rate must be a number' })
        .min(0, 'VAT rate cannot be negative'),
    )
    .default(0),
  description: z.optional(z.string()).default(''),
  mft_date: z.optional(z.string()).default(''),
  exp_date: z.optional(z.string()).default(''),
  in_stock: z.optional(z.number()), // used for stock management (1 = in stock, 0 = out of stock)
  _id: z.optional(z.string()),
  createdAt: z.optional(z.union([z.date(), z.string()])),
  updatedAt: z.optional(z.union([z.date(), z.string()])),
  __v: z.optional(z.number()),
});

export type InvoiceDataTypes = z.infer<typeof validationSchema>;

export interface RegexQuery {
  $regex: string;
  $options: string;
}

export interface Query {
  batch?: RegexQuery;
  name?: RegexQuery;
  category?: RegexQuery;
  store?: RegexQuery;
}

export type RegexFields = Extract<
  keyof Query,
  'batch' | 'name' | 'category' | 'store'
>;
