'use server';

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
  fields?: Record<any, any>;
  issues?: string[];
};

export const deleteSupplier = async (
  prevState: FormState,
  data: FormData,
): Promise<FormState> => {
  try {
    const supplierId = data.get('_id');

    if (!supplierId) {
      return {
        error: true,
        message: 'Supplier ID is required',
      };
    }

    const supplierData = await Supplier.findOneAndDelete({
      _id: supplierId,
    });

    if (supplierData) {
      revalidatePath('/suppliers');
      return {
        error: false,
        message: 'Supplier deleted successfully',
      };
    } else {
      return {
        error: true,
        message: 'Unable to delete the supplier',
      };
    }
  } catch (error: any) {
    return {
      error: true,
      message: 'An error occurred while deleting the supplier',
    };
  }
};

export const createNewSupplier = async (
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

    const supplierData = await Supplier.findOneAndUpdate(
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

    if (supplierData) {
      revalidatePath('/suppliers');
      return {
        error: false,
        message: 'New supplier added successfully',
      };
    } else {
      return {
        error: true,
        message: 'Failed to add the new supplier',
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

export const getAllSuppliersFiltered = async (data: {
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
    addRegexField(query, 'company', searchText.trim());
    addRegexField(query, 'email', searchText.trim());
    addRegexField(query, 'phone', searchText.trim());
    addRegexField(query, 'address', searchText.trim());

    const searchQuery =
      Object.keys(query).length > 0
        ? {
            $or: Object.entries(query).map(([key, value]) => ({
              [key]: value,
            })),
          }
        : { $or: [{}] };

    const count: number = await Supplier.countDocuments(searchQuery);

    const skip = (page - 1) * itemsPerPage;

    let sortQuery: Record<string, 1 | -1> = {
      createdAt: -1,
    };

    const suppliers = await Supplier.aggregate([
      { $match: searchQuery },
      { $sort: sortQuery },
      { $skip: skip },
      { $limit: itemsPerPage },
    ]);

    const pageCount: number = Math.ceil(count / itemsPerPage);

    if (suppliers) {
      let suppliersData = {
        pagination: {
          count,
          pageCount,
        },
        items: suppliers,
      };

      return {
        error: false,
        message: JSON.stringify(suppliersData),
      };
    } else {
      return {
        error: true,
        message: "Couldn't retrieve suppliers data",
      };
    }
  } catch (error: any) {
    return {
      error: true,
      message: 'An error occurred while retrieving suppliers data',
    };
  }
};

export const getAllSuppliers = async (data: {
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

    const count: number = await Supplier.countDocuments({});

    const suppliers = await Supplier.aggregate([
      { $sort: sortQuery },
      { $skip: skip },
      { $limit: itemsPerPage },
    ]);

    const pageCount: number = Math.ceil(count / itemsPerPage);

    if (suppliers) {
      let suppliersData = {
        pagination: {
          count,
          pageCount,
        },
        items: suppliers,
      };

      return {
        error: false,
        message: JSON.stringify(suppliersData),
      };
    } else {
      return {
        error: true,
        message: "Couldn't retrieve suppliers data",
      };
    }
  } catch (error: any) {
    return {
      error: true,
      message: 'An error occurred while retrieving suppliers data',
    };
  }
};

export const editSupplier = async (
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

    let supplierId = parsed.data._id;
    delete parsed.data._id;

    if (!supplierId) {
      return {
        error: true,
        message: 'Supplier ID is missing',
      };
    }

    const supplierData = await Supplier.findByIdAndUpdate(
      supplierId,
      parsed.data,
      {
        new: true,
      },
    );

    if (supplierData) {
      revalidatePath('/suppliers');
      return {
        error: false,
        message: 'Supplier edited successfully',
        fields: supplierData.toObject(),
      };
    } else {
      return {
        error: true,
        message: 'Failed to edit the supplier',
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
