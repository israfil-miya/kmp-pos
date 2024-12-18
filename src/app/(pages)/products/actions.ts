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
import getTodayDate from '@/utility/getTodaysDate';
import { addRegexField } from '@/utility/regexQuery';
import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';
import { ProductDataTypes, ProductSortEnum } from './schema';

import { Query, validationSchema as schema } from './schema';

dbConnect();

export type FormState = {
  error: boolean;
  message: string;
  fields?: Record<any, any>;
  issues?: string[];
};

function getSortQuery(sortType: ProductSortEnum): any {
  switch (sortType) {
    case ProductSortEnum.StockAsc:
      return { quantity: 1 };
    case ProductSortEnum.StockDesc:
      return { quantity: -1 };
    case ProductSortEnum.StatusInStockFirst:
      return { in_stock: -1 };
    case ProductSortEnum.StatusOutOfStockFirst:
      return { in_stock: 1 };
    case ProductSortEnum.ExpirySoonToLater:
      return { exp_date: 1 };
    case ProductSortEnum.ExpiryLaterToSoon:
      return { exp_date: -1 };
    case ProductSortEnum.AddedAsc:
      return { createdAt: 1 };
    case ProductSortEnum.AddedDesc:
      return { createdAt: -1 };
    default:
      return {};
  }
}

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
    const formData = parseFormData(data, ['category', 'supplier']);
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

    const similarProduct = await Product.findOne({
      name: parsed.data.name,
      store: parsed.data.store,
      exp_date: parsed.data.exp_date,
    });

    const productData = await Product.create(parsed.data);

    if (productData) {
      revalidatePath('/products');
      if (similarProduct) {
        return {
          error: false,
          message:
            'A similar product already exists with the same name, expiry date and store, you might want to merge them',
          fields: parsed.data,
        };
      } else {
        return {
          error: false,
          message: 'Product added successfully',
          fields: productData.toObject(),
        };
      }
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
  sortBy?: ProductSortEnum;
  store?: string | null;
}): Promise<FormState> => {
  try {
    const {
      page,
      itemsPerPage,
      filters: { searchText },
    } = data;

    const query: Query = {};

    // Using a utility function to add regex fields for searching
    addRegexField(query, 'name', searchText.trim());
    addRegexField(query, 'batch', searchText.trim(), true);
    addRegexField(query, 'category', searchText.trim());
    addRegexField(query, 'supplier', searchText.trim());
    addRegexField(
      query,
      'store',
      data.store ? data.store.trim() : searchText.trim(),
    );

    // Constructing the search query
    const searchQuery = Object.keys(query).length
      ? { $or: Object.entries(query).map(([key, value]) => ({ [key]: value })) }
      : { $or: [{}] };

    // Count the total number of documents
    const count: number = await Product.countDocuments({
      ...searchQuery,
      $or: [{ exp_date: { $gte: getTodayDate() } }, { exp_date: '' }],
    });

    const skip = (page - 1) * itemsPerPage;

    // Construct the sort query
    const sortQuery = getSortQuery(data.sortBy || ProductSortEnum.AddedDesc);

    const products = await Product.aggregate<ProductDataTypes>([
      {
        $match: {
          $and: [
            searchQuery,
            {
              $or: [{ exp_date: { $gte: getTodayDate() } }, { exp_date: '' }],
            },
          ],
        },
      },
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

    return {
      error: false,
      message: JSON.stringify({
        pagination: { count, pageCount },
        items: products,
      }),
    };
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
  sortBy?: ProductSortEnum;
  store?: string | null;
}): Promise<FormState> => {
  try {
    const { page, itemsPerPage } = data;

    const sortQuery = getSortQuery(data.sortBy || ProductSortEnum.AddedDesc);
    const skip = (page - 1) * itemsPerPage;

    let query: Query = {};
    if (data.store) {
      addRegexField(query, 'store', data.store);
    }

    const searchQuery = {
      ...query,
      $or: [{ exp_date: { $gte: getTodayDate() } }, { exp_date: '' }],
    };

    // Count the total number of documents
    const count: number = await Product.countDocuments(searchQuery);

    const products = await Product.aggregate<ProductDataTypes>([
      {
        $match: searchQuery,
      },
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

    return {
      error: false,
      message: JSON.stringify({
        pagination: { count, pageCount },
        items: products,
      }),
    };
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
    const formData = parseFormData(data, ['category', 'supplier']);
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
      const similarProduct = await Product.findOne({
        name: parsed.data.name,
        store: parsed.data.store,
        exp_date: parsed.data.exp_date,
      });

      if (parsed.data.quantity > Number(productData.quantity)) {
        productData.set({ ...parsed.data, restock_date: getTodayDate() });
      } else {
        productData.set({
          ...parsed.data,
          restock_date: productData.restock_date,
        });
      }
      await productData.save();

      revalidatePath('/products');

      if (
        similarProduct &&
        (similarProduct._id as mongoose.Types.ObjectId).toString() !== productId
      ) {
        return {
          error: false,
          message:
            'A similar product already exists with the same name, expiry date and store, you might want to merge them',
          fields: parsed.data,
        };
      } else {
        return {
          error: false,
          message: 'Product edited successfully',
          fields: productData.toObject(),
        };
      }
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
