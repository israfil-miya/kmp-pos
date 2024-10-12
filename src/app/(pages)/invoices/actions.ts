'use server';

import Invoice from '@/models/Invoices';
import dbConnect from '@/utility/dbConnect';
import { addRegexField } from '@/utility/regexQuery';
import { revalidatePath } from 'next/cache';
import { validationSchema as schema } from '../pos/schema';
import { Query } from './schema';

dbConnect();

export type FormState = {
  error: boolean;
  message: string;
  fields?: Record<any, any>;
  issues?: string[];
};

export const deleteInvoice = async (
  prevState: FormState,
  data: FormData,
): Promise<FormState> => {
  try {
    const invoiceId = data.get('_id');

    if (!invoiceId) {
      return {
        error: true,
        message: 'Invoice ID is required',
      };
    }

    const invoiceData = await Invoice.findOneAndDelete({
      _id: invoiceId,
    });

    if (invoiceData) {
      revalidatePath('/invoices');
      return {
        error: false,
        message: 'Invoice deleted successfully',
      };
    } else {
      return {
        error: true,
        message: 'Unable to delete the Invoice',
      };
    }
  } catch (error: any) {
    return {
      error: true,
      message: 'An error occurred while deleting the invoice',
    };
  }
};

export const getAllInvoicesFiltered = async (data: {
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

    addRegexField(query, 'cashier', searchText.trim());
    addRegexField(query, 'payment_method', searchText.trim(), true);
    addRegexField(query, 'invoice_no', searchText.trim(), true);
    addRegexField(query, 'customer.name', searchText.trim());

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

    const count: number = await Invoice.countDocuments(searchQuery);

    const skip = (page - 1) * itemsPerPage;

    let sortQuery: Record<string, 1 | -1> = {
      createdAt: -1,
    };

    const invoices = await Invoice.aggregate([
      { $match: searchQuery },
      { $sort: sortQuery },
      { $skip: skip },
      { $limit: itemsPerPage },
    ]);

    const pageCount: number = Math.ceil(count / itemsPerPage);

    if (invoices) {
      let invoicesData = {
        pagination: {
          count,
          pageCount,
        },
        items: invoices,
      };

      return {
        error: false,
        message: JSON.stringify(invoicesData),
      };
    } else {
      return {
        error: true,
        message: "Couldn't retrieve invoices data",
      };
    }
  } catch (error: any) {
    console.log('Error:', error);
    return {
      error: true,
      message: 'An error occurred while retrieving invoices data',
    };
  }
};

export const getAllInvoices = async (data: {
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

    const skip = (page - 1) * itemsPerPage;

    let query: Query = {};
    if (data.store) {
      addRegexField(query, 'store_name', data.store);
    }

    const searchQuery = {
      ...query,
    };

    const count: number = await Invoice.countDocuments(searchQuery);

    const invoices = await Invoice.aggregate([
      { $match: searchQuery },
      { $sort: sortQuery },
      { $skip: skip },
      { $limit: itemsPerPage },
    ]);

    const pageCount: number = Math.ceil(count / itemsPerPage);

    if (invoices) {
      let invoicesData = {
        pagination: {
          count,
          pageCount,
        },
        items: invoices,
      };

      return {
        error: false,
        message: JSON.stringify(invoicesData),
      };
    } else {
      return {
        error: true,
        message: "Couldn't retrieve invoices data",
      };
    }
  } catch (error: any) {
    return {
      error: true,
      message: 'An error occurred while retrieving invoices data',
    };
  }
};
