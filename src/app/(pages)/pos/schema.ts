import moment from 'moment-timezone';
import { Types } from 'mongoose';
import { z } from 'zod';

export const validationSchema = z.object({
  invoice_no: z.string().min(1, 'Invoice number cannot be empty'),
  cashier: z.string(),
  customer: z.object({
    name: z.string().default(''),
    phone: z.string().default(''),
    address: z.string().default(''),
  }),
  products: z.array(
    z.object({
      product: z.instanceof(Types.ObjectId),
      unit: z.number().gte(1, 'Unit cannot be less than 1'),
      total_price: z.number().gte(0, 'Total price cannot be negative'),
      total_cost: z.number().gte(0, 'Total cost cannot be negative'),
    }),
  ),
  discount_amount: z.number().gte(0, 'Discount amount cannot be negative'),
  vat_amount: z.number().gte(0, 'VAT amount cannot be negative'),
  sub_total: z.number().gte(0, 'Subtotal cannot be negative'),
  sub_cost: z.number().gte(0, 'Sub cost cannot be negative'),
  grand_total: z.number().gte(0, 'Grand total cannot be negative'),
  paid_amount: z.number().gte(0, 'Paid amount cannot be negative'),
  payment_method: z.string(),

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
