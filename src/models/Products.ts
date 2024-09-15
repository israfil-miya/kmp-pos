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
      validate: [
        {
          validator: function (v: string) {
            return v.trim().length > 0;
          },
          message: 'Batch cannot be empty',
        },
        {
          validator: function (v: string) {
            return /^[A-Za-z0-9]+$/.test(v);
          },
          message: 'Batch must contain only alphanumeric characters',
        },
        {
          validator: function (v: string) {
            return v.trim().length == 8;
          },
          message: 'Batch must be 8 characters long',
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
      validate: {
        validator: function (v: number) {
          return v > 0;
        },
        message: 'Cost price must be greater than zero',
      },
    },
    selling_price: {
      type: Number,
      required: [true, 'Selling price is not given'],
      validate: {
        validator: function (v: number) {
          return v > 0;
        },
        message: 'Selling price must be greater than zero',
      },
    },
    quantity: {
      type: Number,
      default: 0,
      validate: {
        validator: function (v: number) {
          return v >= 0;
        },
        message: 'Quantity cannot be negative',
      },
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
      type: [String],
      required: [true, 'store is not given'],
      validate: {
        validator: function (v: string[]) {
          return v.length > 0;
        },
        message: 'Store cannot be empty',
      },
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
  (mongoose.models.Product as mongoose.Model<Product>) ||
  mongoose.model<Product>('Product', ProductSchema);

export default Product;
