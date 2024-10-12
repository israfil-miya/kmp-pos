import moment from 'moment-timezone';
import { Types } from 'mongoose';
import { z } from 'zod';

export const validationSchema = z
  .object({
    due_balance: z.coerce.number().gte(0, 'Total due cannot be negative'),
    payment_amount: z.coerce.number().gte(0, 'Paid amount cannot be negative'),
    _id: z.optional(z.string()),
  })
  .refine(
    data => {
      if (data.payment_amount <= data.due_balance) {
        console.log(
          'Paid amount cannot be greater than the total due balance',
          data.payment_amount,
          data.due_balance,
        );
        return true;
      }
    },
    {
      path: ['payment_amount'],
      message: 'Paid amount cannot be greater than the total due balance',
    },
  );

export type CreditorDataTypes = z.infer<typeof validationSchema>;

export interface RegexQuery {
  $regex: string;
  $options: string;
}

export interface Query {
  'customer.name'?: RegexQuery;
  'customer.phone'?: RegexQuery;
  'customer.address'?: RegexQuery;
  store_name?: RegexQuery;
  invoice_no?: RegexQuery;
}

export type RegexFields = Extract<
  keyof Query,
  | 'customer.name'
  | 'customer.phone'
  | 'customer.address'
  | 'invoice_no'
  | 'store_name'
>;
