import getTodayDate from '@/utility/getTodaysDate';
import mongoose from 'mongoose';

interface Supplier {
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
    validate: {
      validator: function (v: string) {
        return v.trim().length > 0;
      },
      message: 'Name cannot be empty',
    },
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
