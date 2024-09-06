'use server';
import Category from '@/models/Categories';
import Product from '@/models/Products';
import Store from '@/models/Stores';
import Supplier from '@/models/Suppliers';
import {
  extractDbErrorMessages,
  flattenObject,
  mapFormDataToFields,
  parseFormData,
} from '@/utility/actionHelpers';
import dbConnect from '@/utility/dbConnect';
import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';
import { validationSchema as schema } from './schema';
dbConnect();

export type FormState = {
  error: boolean;
  message: string;
  fields?: Record<string, string | number | string[] | boolean>;
  issues?: string[];
};

interface ProductsRetrieveArgs {
  page: number;
  items_per_page: number;
  filtered: boolean;
  filters: Record<string, string | number | any[] | undefined>;
}

export const createNewProduct = async (
  prevState: FormState,
  data: FormData,
): Promise<FormState> => {
  let parsed;
  try {
    const formData = parseFormData(data, ['store', 'category', 'supplier']);
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

    const productData = await Product.findOneAndUpdate(
      {
        name: parsed.data.name,
      },
      parsed.data,
      {
        upsert: true,
        new: true,
        runValidators: true, // Ensures validation rules are applied
      },
    );

    if (productData) {
      revalidatePath('/products');
      return {
        error: false,
        message: 'New product added successfully',
      };
    } else {
      return {
        error: true,
        message: 'Failed to add the new product',
        fields: parsed.data,
      };
    }
  } catch (error: any) {
    // MongoDB validation errors

    console.log('data', parsed?.data);
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

export const getAllProducts = async (
  data: ProductsRetrieveArgs,
): Promise<FormState> => {
  try {
    const PAGE = data.page;
    const ITEMS_PER_PAGE = data;

    let sortQuery: Record<string, 1 | -1> = {
      in_stock: -1,
      createdAt: -1,
    };
    const products = await Product.find({}, { name: 1, _id: 0 }).lean();

    const productNames = products.map(product => product.name);

    if (products && productNames.length) {
      return {
        error: false,
        message: JSON.stringify(productNames),
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

export const getAllStoreNames = async (): Promise<FormState> => {
  try {
    const stores = await Store.find({}, { name: 1, _id: 0 }).lean();

    const storeNames = stores.map(store => store.name);

    if (stores && storeNames.length) {
      return {
        error: false,
        message: JSON.stringify(storeNames),
      };
    } else {
      return {
        error: true,
        message: "Couldn't retrieve store names",
      };
    }
  } catch (error: any) {
    return {
      error: true,
      message: 'An error occurred while retrieving store names',
    };
  }
};

export const getAllCategoryNames = async (): Promise<FormState> => {
  try {
    const categories = await Category.find({}, { name: 1, _id: 0 }).lean();

    const categoryNames = categories.map(category => category.name);

    if (categories && categoryNames.length) {
      return {
        error: false,
        message: JSON.stringify(categoryNames),
      };
    } else {
      return {
        error: true,
        message: "Couldn't retrieve category names",
      };
    }
  } catch (error: any) {
    return {
      error: true,
      message: 'An error occurred while retrieving category names',
    };
  }
};

export const getAllSupplierNames = async (): Promise<FormState> => {
  try {
    const suppliers = await Supplier.find({}, { name: 1, _id: 0 }).lean();

    const supplierNames = suppliers.map(supplier => supplier.name);

    if (suppliers && supplierNames.length) {
      return {
        error: false,
        message: JSON.stringify(supplierNames),
      };
    } else {
      return {
        error: true,
        message: "Couldn't retrieve supplier names",
      };
    }
  } catch (error: any) {
    return {
      error: true,
      message: 'An error occurred while retrieving supplier names',
    };
  }
};
