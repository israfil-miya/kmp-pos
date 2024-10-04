'use server';

import Product from '@/models/Products';
import {
  extractDbErrorMessages,
  mapFormDataToFields,
  parseFormData,
} from '@/utility/actionHelpers';
import dbConnect from '@/utility/dbConnect';
import getTodayDate from '@/utility/getTodaysDate';
import { addRegexField } from '@/utility/regexQuery';
import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';
import { Query, validationSchema as schema } from './schema';

dbConnect();

export type FormState = {
  error: boolean;
  message: string;
  fields?: Record<any, any>;
  issues?: string[];
};

export const deleteProduct = async (
  prevState: FormState,
  data: FormData,
): Promise<FormState> => {
  try {
    const productId = data.get('_id');

    if (!productId) {
      return {
        error: true,
        message: 'Product ID is required',
      };
    }

    const invoiceData = await Product.findOneAndDelete({
      _id: productId,
    });

    if (invoiceData) {
      revalidatePath('/expired');
      return {
        error: false,
        message: 'Product deleted successfully',
      };
    } else {
      return {
        error: true,
        message: 'Unable to delete the Product',
      };
    }
  } catch (error: any) {
    return {
      error: true,
      message: 'An error occurred while deleting the invoice',
    };
  }
};

export const getAllProductsFiltered = async (data: {
  page: number;
  itemsPerPage: number;
  filters: {
    searchText: string;
  };
}): Promise<FormState> => {
  try {
    const page = data.page;
    const itemsPerPage = data.itemsPerPage;
    const { searchText } = data.filters;

    const query: Query = {};

    addRegexField(query, 'name', searchText.trim());
    addRegexField(query, 'batch', searchText.trim(), true);
    addRegexField(query, 'category', searchText.trim());
    addRegexField(query, 'supplier', searchText.trim());
    addRegexField(query, 'store', searchText.trim());

    const searchQuery =
      Object.keys(query).length > 0
        ? {
            $or: Object.entries(query).map(([key, value]) => ({
              [key]: value,
            })),
          }
        : { $or: [{}] };

    const count: number = await Product.countDocuments({
      ...searchQuery,
      quantity: { $eq: 0 },
    });

    const skip = (page - 1) * itemsPerPage;

    let sortQuery: Record<string, 1 | -1> = {
      createdAt: -1,
    };

    const products = await Product.aggregate([
      { $match: { ...searchQuery, quantity: { $eq: 0 } } },
      { $sort: sortQuery },
      { $skip: skip },
      { $limit: itemsPerPage },
    ]);

    const pageCount: number = Math.ceil(count / itemsPerPage);

    if (products) {
      let productsData = {
        pagination: {
          count,
          pageCount,
        },
        items: products,
      };

      return {
        error: false,
        message: JSON.stringify(productsData),
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

export const getAllProducts = async (data: {
  page: number;
  itemsPerPage: number;
}): Promise<FormState> => {
  try {
    const page = data.page;
    const itemsPerPage = data.itemsPerPage;

    let sortQuery: Record<string, 1 | -1> = {
      createdAt: -1,
    };

    const skip = (page - 1) * itemsPerPage;

    const count: number = await Product.countDocuments({
      quantity: { $eq: 0 },
    });

    const products = await Product.aggregate([
      { $match: { quantity: { $eq: 0 } } },
      { $sort: sortQuery },
      { $skip: skip },
      { $limit: itemsPerPage },
      // { $project: { in_stock: 0 } }, // remove the in_stock field from the final output
    ]);

    const pageCount: number = Math.ceil(count / itemsPerPage);

    if (products) {
      let productsData = {
        pagination: {
          count,
          pageCount,
        },
        items: products,
      };

      return {
        error: false,
        message: JSON.stringify(productsData),
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

export const editProduct = async (
  prevState: FormState,
  data: FormData,
): Promise<FormState> => {
  let parsed;
  try {
    const formData = parseFormData(data);
    parsed = schema.safeParse(formData);

    if (!parsed.success) {
      const fields = mapFormDataToFields(formData);
      return {
        error: true,
        message: 'Invalid form data',
        fields,
        issues: parsed.error.issues.map(issue => issue.message),
      };
    }

    let productId = parsed.data._id;
    delete parsed.data._id;

    if (!productId) {
      return {
        error: true,
        message: 'Product ID is missing',
      };
    }

    const productData = await Product.findById(productId);

    if (productData) {
      if (Number(productData.quantity) !== parsed.data.quantity) {
        productData.set({ ...parsed.data, restock_date: getTodayDate() });
      } else {
        productData.set(parsed.data);
      }
      await productData.save();
      revalidatePath('/products');
      return {
        error: false,
        message: 'Product edited successfully',
        fields: productData.toObject(),
      };
    } else {
      return {
        error: true,
        message: 'Failed to edit the product',
        fields: parsed.data,
      };
    }
  } catch (error: any) {
    // MongoDB validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const validationIssues = extractDbErrorMessages(error);
      return {
        error: true,
        message: 'Invalid form data',
        fields: parsed?.data,
        issues: validationIssues,
      };
    }

    console.error(error);
    return {
      error: true,
      message: 'An error occurred while submitting the form',
      fields: parsed?.data,
    };
  }
};
