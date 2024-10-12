'use server';

import Invoice from '@/models/Invoices';
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

export const getAllCreditorsFiltered = async (data: {
  page: number;
  itemsPerPage: number;
  filters: {
    searchText: string;
  };
  store?: string | null;
}): Promise<FormState> => {
  try {
    const page = data.page;
    const itemsPerPage = data.itemsPerPage;
    const { searchText } = data.filters;

    const query: Query = {};

    addRegexField(query, 'customer.name', searchText.trim());
    addRegexField(query, 'customer.address', searchText.trim());
    addRegexField(query, 'customer.phone', searchText.trim());
    addRegexField(query, 'customer.address', searchText.trim());
    addRegexField(query, 'invoice_no', searchText.trim(), true);

    addRegexField(
      query,
      'store_name',
      data.store ? data.store.trim() : searchText.trim(),
    );

    const searchQuery =
      Object.keys(query).length > 0
        ? {
            $or: Object.entries(query).map(([key, value]) => ({
              [key]: value,
            })),
          }
        : { $or: [{}] };

    const count: number = await Invoice.countDocuments({
      ...searchQuery,
      $expr: { $lt: ['$paid_amount', '$grand_total'] },
    });

    const skip = (page - 1) * itemsPerPage;

    let sortQuery: Record<string, 1 | -1> = {
      createdAt: -1,
    };

    const creditors = await Invoice.aggregate([
      {
        $match: {
          ...searchQuery,
          $expr: { $lt: ['$paid_amount', '$grand_total'] },
        },
      },
      { $sort: sortQuery },
      { $skip: skip },
      { $limit: itemsPerPage },
    ]);

    const pageCount: number = Math.ceil(count / itemsPerPage);

    if (creditors) {
      let creditorsData = {
        pagination: {
          count,
          pageCount,
        },
        items: creditors,
      };

      return {
        error: false,
        message: JSON.stringify(creditorsData),
      };
    } else {
      return {
        error: true,
        message: "Couldn't retrieve creditors data",
      };
    }
  } catch (error: any) {
    return {
      error: true,
      message: 'An error occurred while retrieving creditors data',
    };
  }
};

export const getAllCreditors = async (data: {
  page: number;
  itemsPerPage: number;
  store?: string | null;
}): Promise<FormState> => {
  try {
    const page = data.page;
    const itemsPerPage = data.itemsPerPage;

    let sortQuery: Record<string, 1 | -1> = {
      createdAt: -1,
    };

    let query: Query = {};
    if (data.store) {
      addRegexField(query, 'store_name', data.store);
    }

    const searchQuery = {
      ...query,
      $expr: { $lt: ['$paid_amount', '$grand_total'] },
    };

    const skip = (page - 1) * itemsPerPage;

    const count: number = await Invoice.countDocuments(searchQuery);

    const creditors = await Invoice.aggregate([
      { $match: searchQuery },
      { $sort: sortQuery },
      { $skip: skip },
      { $limit: itemsPerPage },
    ]);

    const pageCount: number = Math.ceil(count / itemsPerPage);

    if (creditors) {
      let creditorsData = {
        pagination: {
          count,
          pageCount,
        },
        items: creditors,
      };

      return {
        error: false,
        message: JSON.stringify(creditorsData),
      };
    } else {
      return {
        error: true,
        message: "Couldn't retrieve creditors data",
      };
    }
  } catch (error: any) {
    return {
      error: true,
      message: 'An error occurred while retrieving creditors data',
    };
  }
};

export const editCreditor = async (
  prevState: FormState,
  data: FormData,
): Promise<FormState> => {
  let parsed;
  try {
    const formData = parseFormData(data);
    parsed = schema.safeParse(formData);

    if (!parsed.success) {
      const fields = mapFormDataToFields(formData);
      console.log(parsed.error.issues);
      return {
        error: true,
        message: 'Invalid form data',
        fields,
        issues: parsed.error.issues.map(issue => issue.message),
      };
    }

    let invoiceId = parsed.data._id;
    delete parsed.data._id;

    if (!invoiceId) {
      return {
        error: true,
        message: 'Invoice ID is missing',
      };
    }

    const productData = await Invoice.findById(invoiceId);

    if (productData) {
      productData.paid_amount =
        productData.paid_amount + parsed.data.payment_amount;

      await productData.save();
      revalidatePath('/creditors');
      return {
        error: false,
        message: 'Invoice edited successfully',
        fields: productData.toObject(),
      };
    } else {
      return {
        error: true,
        message: 'Failed to edit the invoice',
        fields: parsed.data,
      };
    }
  } catch (error: any) {
    console.error(error);

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
