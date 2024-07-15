import mongoose from 'mongoose';

interface Store {
  name: string;
  location?: string;
  manager: string;
  phone: string;
  status?: string;
}

const StoreSchema = new mongoose.Schema<Store>({
  name: {
    type: String,
    required: [true, 'Name is not given'],
  },
  location: {
    type: String,
    default: '',
  },
  manager: { type: String, required: [true, 'Manager name is not given'] },
  phone: { type: String, required: [true, 'Phone number is not given'] },
  status: { type: String, default: 'open' },
});

const Store =
  mongoose.models.Store || mongoose.model<Store>('Store', StoreSchema);

export default Store;
