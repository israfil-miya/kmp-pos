import mongoose from 'mongoose';

export interface Store extends mongoose.Document {
  name: string;
  location: string;
  manager: string;
  phone: string;
  status: string;
}

const StoreSchema = new mongoose.Schema<Store>({
  name: {
    type: String,
    required: [true, 'Name is not given'],
    minlength: [1, 'Name must be at least 1 character'],
  },
  location: { type: String, default: '' },
  manager: { type: String, default: '' },
  phone: { type: String, default: '' },
  status: {
    type: String,
    default: 'open',
    enum: {
      values: ['open', 'closed'],
      message: 'Status must be either "open" or "closed"',
    },
  },
});

const Store =
  (mongoose.models.Store as mongoose.Model<Store>) ||
  mongoose.model<Store>('Store', StoreSchema);

export default Store;
