import moment from 'moment-timezone';
import { z } from 'zod';

export const validationSchema = z
  .object({
    batch: z.string().length(8, 'Batch must be 8 characters long'),
    name: z.string().min(1, 'Name is required'),
    cost_price: z.coerce
      .number()
      .gte(1, 'Cost price must be greater than zero'),
    selling_price: z.coerce
      .number()
      .gte(1, 'Selling price must be greater than zero'),
    quantity: z.coerce.number().nonnegative('Quantity cannot be in negative'),
    supplier: z.array(z.string()).min(1, 'Supplier is required'),
    category: z.array(z.string()).min(1, 'Category is required'),
    store: z.array(z.string()).min(1, 'Store is required'),

    description: z.optional(z.string()).default(''),
    mft_date: z.optional(z.string()).default(''),
    exp_date: z.optional(z.string()).default(''),
    in_stock: z.optional(z.boolean()),
    _id: z.optional(z.string()),
    createdAt: z.optional(z.string()),
    updatedAt: z.optional(z.string()),
    __v: z.optional(z.number()),
  })
  .refine(data => data.selling_price >= data.cost_price, {
    path: ['selling_price'],
    message: 'Selling price must be greater than or equal to cost price',
  })
  .refine(
    data => {
      const mftDate = moment(data.mft_date, 'YYYY-MM-DD', true);
      const expDate = moment(data.exp_date, 'YYYY-MM-DD', true);

      if (data.mft_date && !mftDate.isValid()) {
        return false; // Invalid manufacturing date format
      }
      if (data.exp_date && !expDate.isValid()) {
        return false; // Invalid expiration date format
      }

      if (data.mft_date && data.exp_date) {
        return expDate.isAfter(mftDate, 'day');
      }

      return true; // If no mft_date or no exp_date, validation is not required
    },
    {
      path: ['exp_date'],
      message:
        'Expiration date must be at least one day after the manufacturing date',
    },
  )
  .refine(
    data => {
      const mftDate = moment(data.mft_date, 'YYYY-MM-DD', true);
      if (data.mft_date && mftDate.isAfter(moment(), 'day')) {
        return false; // Manufacturing date is in the future
      }
      return true;
    },
    {
      path: ['mft_date'],
      message: 'Manufacturing date cannot be in the future',
    },
  )
  .refine(
    data => {
      const expDate = moment(data.exp_date, 'YYYY-MM-DD', true);
      if (data.exp_date && expDate.isBefore(moment(), 'day')) {
        return false; // Expiration date is in the past
      }
      return true;
    },
    {
      path: ['exp_date'],
      message: 'Expiration date cannot be in the past',
    },
  );

export type ProductDataTypes = z.infer<typeof validationSchema>;
