import mongoose from 'mongoose';

interface Product {
  batch: string;
  name: string;
  description: string;
  cost_price: number;
  selling_price: number;
  quantity: number;
  supplier: string[];
  category: string[];
  store: string[];
  mft_date: string;
  exp_date: string;
}

const ProductSchema = new mongoose.Schema<Product>(
  {
    batch: {
      type: String,
      required: [true, 'Batch is not given'],
    },
    name: {
      type: String,
      required: [true, 'Name is not given'],
    },
    description: {
      type: String,
      default: '',
    },
    cost_price: {
      type: Number,
      required: [true, 'Cost price is not given'],
    },
    selling_price: {
      type: Number,
      required: [true, 'Selling price is not given'],
    },
    quantity: {
      type: Number,
      default: 0,
    },
    supplier: {
      type: [String],
      required: [true, 'Supplier is not given'],
    },
    category: {
      type: [String],
      required: [true, 'Category is not given'],
    },
    store: {
      type: [String],
      required: [true, 'store is not given'],
    },
    mft_date: {
      type: String,
      default: '',
    },
    exp_date: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

const Product =
  mongoose.models.Product || mongoose.model<Product>('Product', ProductSchema);

export default Product;
