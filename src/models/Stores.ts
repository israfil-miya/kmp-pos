import mongoose from 'mongoose';

interface Store {
  name: string;
  location?: string;
  manager?: string;
  phone?: string;
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
  manager: { type: String, default: '' },
  phone: { type: String, default: ''},
  status: { type: String, default: 'open' },
});

const Store =
  mongoose.models.Store || mongoose.model<Store>('Store', StoreSchema);

export default Store;
