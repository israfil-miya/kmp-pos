import mongoose from 'mongoose';

export interface Invoice extends mongoose.Document {
  invoice_no: string;
  cashier: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  products: {
    name: string;
    category: string[];
    unit: number;
    total_price: number;
    total_cost: number;
    product_id: mongoose.Types.ObjectId;
  }[];
  discount_amount: number;
  vat_amount: number;
  sub_total: number;
  grand_total: number;
  sub_cost: number;
  paid_amount: number;
  payment_method: string;
  store_name: string;
}

const InvoiceSchema = new mongoose.Schema<Invoice>(
  {
    invoice_no: {
      type: String,
      required: [true, 'Invoice number is not given'],
      unique: true, // Ensure unique invoice number
      minlength: [1, 'Invoice number cannot be empty'], // Ensure invoice number is not empty
    },
    cashier: {
      type: String,
      required: [true, 'Cashier name is not given'],
      minlength: [1, 'Cashier name cannot be empty'], // Ensure cashier name is not empty
    },
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
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: [true, 'Product id is not given'], // Product reference is required
        },
        name: {
          type: String,
          required: [true, 'Product name is not given'],
          minlength: [1, 'Product name cannot be empty'], // Ensure product name is not empty
        },
        category: {
          type: [String],
          required: [true, 'Product category is not given'],
          validate: {
            validator: (categories: string[]) => categories.length > 0,
            message: 'Product category cannot be empty',
          },
        },
        unit: {
          type: Number,
          required: [true, 'Unit is not given'],
          min: [1, 'Unit cannot be less than 1'], // Ensure positive unit
        },
        total_price: {
          type: Number,
          required: [true, 'Total price is not given'],
          min: [0, 'Total price cannot be negative'], // Ensure positive price
        },
        total_cost: {
          type: Number,
          required: [true, 'Total cost is not given'],
          min: [0, 'Total cost cannot be negative'], // Ensure positive cost
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

    // Sub cost is the total cost before VAT and discount
    sub_cost: {
      type: Number,
      required: [true, 'Sub cost amount is not given'],
      min: [0, 'Total cost cannot be negative'], // Ensure positive
    },

    // Total is the final amount after VAT and discount
    grand_total: {
      type: Number,
      required: [true, 'Total amount is not given'],
      min: [0, 'Total amount cannot be negative'], // Ensure positive
    },

    vat_amount: {
      type: Number,
      default: 0, // Default VAT to 0 if not provided
      min: [0, 'VAT amount cannot be negative'],
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
        values: ['cash', 'card', 'bkash', 'nagad', 'rocket', 'check', 'bank'],
        message: 'Invalid payment method',
      },
    },

    store_name: {
      type: String,
      required: [true, 'Store name is not given'],
      minlength: [1, 'Store name cannot be empty'], // Ensure store name is not empty
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
