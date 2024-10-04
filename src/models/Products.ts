import getTodayDate from '@/utility/getTodaysDate';
import mongoose from 'mongoose';

export interface Product extends mongoose.Document {
  batch: string;
  name: string;
  description: string;
  cost_price: number;
  selling_price: number;
  quantity: number;
  supplier: string[];
  category: string[];
  store: string;
  vat_rate: number;
  mft_date: string;
  exp_date: string;
  restock_date: string;
}

const ProductSchema = new mongoose.Schema<Product>(
  {
    batch: {
      type: String,
      required: [true, 'Batch is not given'],
      unique: true,
      minlength: [1, 'Batch must be at least 1 character'],
      maxlength: [8, 'Batch must be at most 8 characters'],
      validate: [
        {
          validator: function (v: string) {
            return /^[A-Za-z0-9]+$/.test(v);
          },
          message: 'Batch must contain only alphanumeric characters',
        },
      ],
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
      min: [0, 'Cost price cannot be negative'],
    },
    selling_price: {
      type: Number,
      required: [true, 'Selling price is not given'],
      min: [0, 'Selling price cannot be negative'],
    },
    quantity: {
      type: Number,
      default: 0,
      min: [0, 'Quantity cannot be negative'],
    },
    supplier: {
      type: [String],
      required: [true, 'Supplier is not given'],
      validate: {
        validator: function (v: string[]) {
          return v.length > 0;
        },
        message: 'Store cannot be empty',
      },
    },
    category: {
      type: [String],
      required: [true, 'Category is not given'],
      validate: {
        validator: function (v: string[]) {
          return v.length > 0;
        },
        message: 'Store cannot be empty',
      },
    },
    store: {
      type: String,
      required: [true, 'Store is not given'],
      unique: true,
      minlength: [1, 'Store must be at least 1 character'],
    },
    vat_rate: {
      type: Number,
      default: 0,
      min: [0, 'VAT rate cannot be negative'],
    },
    mft_date: {
      type: String,
      default: '',
    },
    exp_date: {
      type: String,
      default: '',
    },

    // last restock date
    restock_date: {
      type: String,
      default: getTodayDate(),
    },
  },
  { timestamps: true },
);

const Product =
  (mongoose.models.Product as mongoose.Model<Product>) ||
  mongoose.model<Product>('Product', ProductSchema);

export default Product;
