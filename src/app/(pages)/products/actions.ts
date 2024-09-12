'use server';
import Category from '@/models/Categories';
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
import { Query, validationSchema as schema } from './schema';

dbConnect();

export type FormState = {
  error: boolean;
  message: string;
  fields?: Record<string, string | number | string[] | boolean | Date>;
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

    const productData = await Product.findOneAndDelete({
      _id: productId,
    });

    if (productData) {
      revalidatePath('/products');
      return {
        error: false,
        message: 'Product deleted successfully',
      };
    } else {
      return {
        error: true,
        message: 'Unable to delete the product',
      };
    }
  } catch (error: any) {
    return {
      error: true,
      message: 'An error occurred while deleting the product',
    };
  }
};

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

    const count: number = await Product.countDocuments(searchQuery);

    const skip = (page - 1) * itemsPerPage;

    let sortQuery: Record<string, 1 | -1> = {
      in_stock: -1,
      createdAt: -1,
    };

    const products = await Product.aggregate([
      { $match: searchQuery },
      {
        $addFields: {
          in_stock: {
            $cond: { if: { $gt: ['$quantity', 0] }, then: 1, else: 0 },
          },
        },
      },
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
      in_stock: -1,
      createdAt: -1,
    };

    const skip = (page - 1) * itemsPerPage;

    const count: number = await Product.countDocuments({});

    const products = await Product.aggregate([
      {
        $addFields: {
          in_stock: {
            $cond: { if: { $gt: ['$quantity', 0] }, then: 1, else: 0 },
          },
        },
      },
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

export const editProduct = async (
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

    let productId = parsed.data._id;
    delete parsed.data._id;

    if (!productId) {
      return {
        error: true,
        message: 'Product ID is missing',
      };
    }

    const productData = await Product.findByIdAndUpdate(
      productId,
      parsed.data,
      {
        new: true,
      },
    );

    if (productData) {
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
