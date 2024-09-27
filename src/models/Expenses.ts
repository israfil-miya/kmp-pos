import getTodayDate from '@/utility/getTodaysDate';
import mongoose from 'mongoose';

export interface Expense extends mongoose.Document {
  title: string;
  amount: number;
  date: string;
  category: string;
  full_name: string;
}

const ExpenseSchema = new mongoose.Schema<Expense>(
  {
    title: {
      type: String,
      minlength: [1, 'Title must be at least 1 character'],
      required: [true, 'Title is required'],
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
  },
  { timestamps: true },
);

const Expense =
  (mongoose.models.Expense as mongoose.Model<Expense>) ||
  mongoose.model<Expense>('Expense', ExpenseSchema);

export default Expense;
