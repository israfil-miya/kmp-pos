import mongoose from 'mongoose';
import { z } from 'zod';

export const validationSchema = z.object({
  cashier: z.string(),
  customer: z.object({
    name: z.string(),
    phone: z.string(),
    address: z.string(),
  }),
  products: z.array(
    z.object({
      product: z.custom<mongoose.Types.ObjectId>(),
      unit: z.coerce.number(),
      total_price: z.coerce.number(),
    }),
  ),
  discount_amount: z.coerce.number(),
  sub_total: z.coerce.number(),
  grand_total: z.coerce.number(),
  paid_amount: z.coerce.number(),
  payment_method: z.coerce.number(),
  _id: z.custom<mongoose.Types.ObjectId>(),
  createdAt: z.optional(z.string()),
  updatedAt: z.optional(z.string()),
});

export type InvoiceDataTypes = z.infer<typeof validationSchema>;

export interface RegexQuery {
  $regex: string;
  $options: string;
}

export interface Query {
  cashier?: RegexQuery;
  payment_method?: RegexQuery;
}

export type RegexFields = Extract<keyof Query, 'cashier' | 'payment_method'>;
