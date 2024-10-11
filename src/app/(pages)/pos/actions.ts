'use server';
import Invoice from '@/models/Invoices';
import Product from '@/models/Products';
import { extractDbErrorMessages } from '@/utility/actionHelpers';
import dbConnect from '@/utility/dbConnect';
import { addRegexField } from '@/utility/regexQuery';
import mongoose from 'mongoose';
import { InvoiceDataTypes } from './schema';

dbConnect();

import getTodayDate from '@/utility/getTodaysDate';
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

    const searchConditions = Object.entries(query).map(([key, value]) => ({
      [key]: value,
    }));

    console.log('searchConditions:', searchConditions);
    console.log('store:', store);
    console.log('Today Date:', getTodayDate());

    let sortQuery: Record<string, 1 | -1> = {
      // sort by exp_date from expired soon to later
      exp_date: 1,
      createdAt: -1,
    };

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
          $and: [
            searchConditions.length > 0 ? { $or: searchConditions } : {},
            {
              in_stock: 1,

              $or: [
                {
                  exp_date: { $gte: getTodayDate() },
                },
                {
                  exp_date: '',
                },
              ],
              store: { $regex: `^${store}$`, $options: 'i' },
            },
          ],
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
    console.error(error);

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
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // go through data.products and for each product convert the product id to a mongoose.Types.ObjectId
    data.products = data.products.map(product => {
      console.log('product:', product);
      return {
        ...product,
        product_id: new mongoose.Types.ObjectId(product.product_id),
      };
    });

    parsed = schema.safeParse(data);

    console.log('parsed:', parsed.data?.products, data);

    if (!parsed.success) {
      console.log('HERE: ', parsed.error.issues, data);
      return {
        error: true,
        message: 'Invalid invoice data',
      };
    }

    const invoice = await Invoice.create(parsed.data);

    if (invoice) {
      // update the stock of each product in the invoice
      for (let i = 0; i < data.products.length; i++) {
        const product = data.products[i];
        const productData = await Product.findById(product.product_id);
        productData!.quantity -= product.unit;
        await productData!.save();
      }

      await session.commitTransaction();
      session.endSession();

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

    await session.abortTransaction();
    session.endSession();

    if (error instanceof mongoose.Error.ValidationError) {
      const validationIssues = extractDbErrorMessages(error);

      console.log('HERE VALIDATION ISSUE: ', validationIssues, data);
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
