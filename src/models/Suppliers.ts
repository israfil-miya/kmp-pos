import getTodayDate from '@/utility/gettodaysdate';
import mongoose from 'mongoose';

interface Supplier {
  name: string;
  company: string;
  reg_date?: string;
  email: string;
  phone: string;
  address?: string;
}

const SupplierSchema = new mongoose.Schema<Supplier>({
  name: {
    type: String,
    required: [true, 'Name is not given'],
  },
  company: {
    type: String,
    required: [true, 'Company is not given'],
  },
  reg_date: {
    type: String,
    default: getTodayDate(),
  },
  email: {
    type: String,
    required: [true, 'Email is not given'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is not given'],
  },
  address: {
    type: String,
    default: '',
  },
});

const Supplier =
  mongoose.models.Supplier ||
  mongoose.model<Supplier>('Supplier', SupplierSchema);

export default Supplier;
