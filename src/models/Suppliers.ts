import { getTodayDate } from '@/utility/date';
import mongoose from 'mongoose';

export interface Supplier extends mongoose.Document {
  name: string;
  company: string;
  reg_date: string;
  email: string;
  phone: string;
  address: string;
}

const SupplierSchema = new mongoose.Schema<Supplier>({
  name: {
    type: String,
    required: [true, 'Name is not given'],
    minlength: [1, 'Name must be at least 1 character'],
  },
  company: {
    type: String,
    default: '',
  },
  reg_date: {
    type: String,
    default: getTodayDate(),
  },
  email: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
});

const Supplier =
  (mongoose.models.Supplier as mongoose.Model<Supplier>) ||
  mongoose.model<Supplier>('Supplier', SupplierSchema);

export default Supplier;
