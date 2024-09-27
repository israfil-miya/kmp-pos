import mongoose from 'mongoose';

export interface Invoice extends mongoose.Document {
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  products: {
    product: string;
    quantity: number;
    total_price: number;
  }[];
  discount_amount: number;
  sub_total: number;
  grand_total: number;
  paid_amount: number;
  payment_method: string;
}

const InvoiceSchema = new mongoose.Schema<Invoice>(
  {
    customer: {
      name: {
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
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: [true, 'Product id is not given'], // Product reference is required
        },
        quantity: {
          type: Number,
          required: [true, 'Quantity is not given'],
          min: [1, 'Quantity cannot be less than 1'], // Ensure positive quantity
        },
        total_price: {
          type: Number,
          required: [true, 'Total price is not given'],
          min: [0, 'Total price cannot be negative'], // Ensure positive price
        },
      },
    ],
    discount_amount: {
      type: Number,
      default: 0, // Default discount to 0 if not provided
      min: [0, 'Discount amount cannot be negative'],
    },

    // Subtotal is the total amount before VAT and discount
    sub_total: {
      type: Number,
      required: [true, 'Subtotal amount is not given'],
      min: [0, 'Total amount cannot be negative'], // Ensure positive
    },

    // Total is the final amount after VAT and discount
    grand_total: {
      type: Number,
      required: [true, 'Total amount is not given'],
      min: [0, 'Total amount cannot be negative'], // Ensure positive
    },

    paid_amount: {
      type: Number,
      required: [true, 'Paid amount is not given'],
      min: [0, 'Paid amount cannot be negative'], // Ensure positive amount
    },
    payment_method: {
      type: String,
      required: [true, 'Payment method is not given'],
      enum: {
        values: ['cash', 'card', 'bkash', 'nagad', 'rocket'],
        message: 'Invalid payment method',
      },
    },
  },
  {
    timestamps: true,
  },
);

const Invoice =
  (mongoose.models.Invoice as mongoose.Model<Invoice>) ||
  mongoose.model<Invoice>('Invoice', InvoiceSchema);

export default Invoice;
