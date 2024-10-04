'use server';
import Category from '@/models/Categories';
import Invoice from '@/models/Invoices';
import Product from '@/models/Products';
import Store from '@/models/Stores';
import Supplier from '@/models/Suppliers';
import {
  extractDbErrorMessages,
  mapFormDataToFields,
  parseFormData,
} from '@/utility/actionHelpers';
import dbConnect from '@/utility/dbConnect';
import { addRegexField } from '@/utility/regexQuery';
import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';
import { InvoiceDataTypes } from './schema';

dbConnect();

import { Query, validationSchema as schema } from './schema';

export type FormState = {
  error: boolean;
  message: string;
  fields?: Record<any, any>;
  issues?: string[];
};

export const getAllProductsFiltered = async (data: {
  filters: {
    searchText: string;
    store: string;
  };
}): Promise<FormState> => {
  try {
    const { searchText, store } = data.filters;

    const query: Query = {};

    addRegexField(query, 'name', searchText.trim());
    addRegexField(query, 'batch', searchText.trim(), true);
    addRegexField(query, 'category', searchText.trim());

    const searchQuery =
      Object.keys(query).length > 0
        ? {
            $or: Object.entries(query).map(([key, value]) => ({
              [key]: value,
            })),
          }
        : { $or: [{}] };

    let sortQuery: Record<string, 1 | -1> = {
      in_stock: -1,
      createdAt: -1,
    };

    console.log(searchQuery['$or']);

    const products = await Product.aggregate([
      {
        $addFields: {
          in_stock: {
            $cond: { if: { $gt: ['$quantity', 0] }, then: 1, else: 0 },
          },
        },
      },
      {
        $match: {
          ...searchQuery,
          in_stock: 1,
          store: { $regex: `^${store}$`, $options: 'i' },
        },
      },
      { $sort: sortQuery },
    ]);

    if (products) {
      return {
        error: false,
        message: JSON.stringify(products),
      };
    } else {
      return {
        error: true,
        message: "Couldn't retrieve products data",
      };
    }
  } catch (error: any) {
    return {
      error: true,
      message: 'An error occurred while retrieving products data',
    };
  }
};

export const createNewInvoice = async (
  data: InvoiceDataTypes,
): Promise<FormState> => {
  let parsed;
  try {
    // go through data.products and for each product convert the product id to a mongoose.Types.ObjectId
    data.products = data.products.map(product => {
      return {
        ...product,
        product: new mongoose.Types.ObjectId(product.product),
      };
    });

    parsed = schema.safeParse(data);

    if (!parsed.success) {
      console.log(parsed.error.issues);
      return {
        error: true,
        message: 'Invalid invoice data',
      };
    }

    const invoice = await Invoice.create(data);

    if (invoice) {
      return {
        error: false,
        message: 'New invoice created successfully',
      };
    } else {
      return {
        error: true,
        message: 'Failed to create the new invoice',
      };
    }
  } catch (error: any) {
    // MongoDB validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const validationIssues = extractDbErrorMessages(error);
      return {
        error: true,
        message: 'Invalid invoice data',
        issues: validationIssues,
      };
    }

    console.error(error);
    return {
      error: true,
      message: 'An error occurred while submitting the data',
    };
  }
};
