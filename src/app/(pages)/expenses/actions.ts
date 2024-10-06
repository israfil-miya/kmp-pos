'use server';

import Expense from '@/models/Expenses';
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

export const deleteExpense = async (
  prevState: FormState,
  data: FormData,
): Promise<FormState> => {
  try {
    const expenseId = data.get('_id');

    if (!expenseId) {
      return {
        error: true,
        message: 'Expense ID is required',
      };
    }

    const expenseData = await Expense.findOneAndDelete({
      _id: expenseId,
    });

    if (expenseData) {
      revalidatePath('/expenses');
      return {
        error: false,
        message: 'Expense deleted successfully',
      };
    } else {
      return {
        error: true,
        message: 'Unable to delete the expense',
      };
    }
  } catch (error: any) {
    return {
      error: true,
      message: 'An error occurred while deleting the expense',
    };
  }
};

export const createNewExpense = async (
  prevState: FormState,
  data: FormData,
): Promise<FormState> => {
  let parsed;
  try {
    const formData = parseFormData(data);
    parsed = schema.safeParse(formData);

    if (!parsed.success) {
      const fields = mapFormDataToFields(formData);
      console.log('fields', parsed.error.issues);
      return {
        error: true,
        message: 'Invalid form data',
        fields,
        issues: parsed.error.issues.map(issue => issue.message),
      };
    }

    const expenseData = await Expense.create(parsed.data);

    if (expenseData) {
      revalidatePath('/expenses');
      return {
        error: false,
        message: 'New expense added successfully',
      };
    } else {
      return {
        error: true,
        message: 'Failed to add the new expense',
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

export const getAllExpensesFiltered = async (data: {
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

    addRegexField(query, 'reason', searchText.trim());
    addRegexField(query, 'category', searchText.trim(), true);
    addRegexField(query, 'full_name', searchText.trim());

    const searchQuery =
      Object.keys(query).length > 0
        ? {
            $or: Object.entries(query).map(([key, value]) => ({
              [key]: value,
            })),
          }
        : { $or: [{}] };

    const count: number = await Expense.countDocuments(searchQuery);

    const skip = (page - 1) * itemsPerPage;

    let sortQuery: Record<string, 1 | -1> = {
      due_amount: -1,
    };

    const expenses = await Expense.aggregate([
      {
        $addFields: {
          due_amount: {
            $subtract: ['$grand_total', '$paid_amount'], // Calculate due amount
          },
        },
      },
      { $sort: sortQuery },
      {
        $project: {
          due_amount: 0,
        },
      },
      { $skip: skip },
      { $limit: itemsPerPage },
    ]);

    const pageCount: number = Math.ceil(count / itemsPerPage);

    if (expenses) {
      let expensesData = {
        pagination: {
          count,
          pageCount,
        },
        items: expenses,
      };

      return {
        error: false,
        message: JSON.stringify(expensesData),
      };
    } else {
      return {
        error: true,
        message: "Couldn't retrieve expenses data",
      };
    }
  } catch (error: any) {
    return {
      error: true,
      message: 'An error occurred while retrieving expenses data',
    };
  }
};

export const getAllExpenses = async (data: {
  page: number;
  itemsPerPage: number;
}): Promise<FormState> => {
  try {
    const page = data.page;
    const itemsPerPage = data.itemsPerPage;

    let sortQuery: Record<string, 1 | -1> = {
      due_amount: -1,
    };

    const skip = (page - 1) * itemsPerPage;

    const count: number = await Expense.countDocuments({});

    const expenses = await Expense.aggregate([
      {
        $addFields: {
          due_amount: {
            $subtract: ['$grand_total', '$paid_amount'], // Calculate due amount
          },
        },
      },
      { $sort: sortQuery },
      {
        $project: {
          due_amount: 0,
        },
      },
      { $skip: skip },
      { $limit: itemsPerPage },
    ]);

    const pageCount: number = Math.ceil(count / itemsPerPage);

    if (expenses) {
      let expensesData = {
        pagination: {
          count,
          pageCount,
        },
        items: expenses,
      };

      return {
        error: false,
        message: JSON.stringify(expensesData),
      };
    } else {
      return {
        error: true,
        message: "Couldn't retrieve expenses data",
      };
    }
  } catch (error: any) {
    return {
      error: true,
      message: 'An error occurred while retrieving expenses data',
    };
  }
};

export const editExpense = async (
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

    let expenseId = parsed.data._id;
    delete parsed.data._id;

    if (!expenseId) {
      return {
        error: true,
        message: 'Expense ID is missing',
      };
    }

    const expenseData = await Expense.findByIdAndUpdate(
      expenseId,
      parsed.data,
      {
        new: true,
      },
    );

    if (expenseData) {
      revalidatePath('/expenses');
      return {
        error: false,
        message: 'Expense edited successfully',
        fields: expenseData.toObject(),
      };
    } else {
      return {
        error: true,
        message: 'Failed to edit the expense',
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
