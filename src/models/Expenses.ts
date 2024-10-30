import { getTodayDate } from '@/utility/date';
import mongoose from 'mongoose';

export interface Expense extends mongoose.Document {
  reason: string;
  amount: number;
  category: string;
  full_name: string;
  store_name?: string;
}

const ExpenseSchema = new mongoose.Schema<Expense>(
  {
    reason: {
      type: String,
      minlength: [1, 'Reason must be at least 1 character'],
      required: [true, 'Reason is required'],
    },
    amount: {
      type: Number,
      min: [0, "Amount can't be negative"],
      required: [true, 'Amount is required'],
    },
    category: {
      type: String,
      minlength: [1, 'Category must be at least 1 character'],
      required: [true, 'Category is required'],
    },
    full_name: {
      type: String,
      minlength: [1, 'Full name must be at least 1 character'],
      required: [true, 'Full name is required'],
    },
    store_name: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

const Expense =
  (mongoose.models.Expense as mongoose.Model<Expense>) ||
  mongoose.model<Expense>('Expense', ExpenseSchema);

export default Expense;
