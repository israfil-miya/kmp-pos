'use server';
import Category from '@/models/Categories';
import {
  extractDbErrorMessages,
  mapFormDataToFields,
} from '@/utility/actionHelpers';
import dbConnect from '@/utility/dbConnect';
import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';
import { validationSchema as schema } from './schema';
dbConnect();

export type FormState = {
  error: boolean;
  message: string;
  fields?: Record<any, any>;
  issues?: string[];
};

export const createNewCategory = async (
  prevState: FormState,
  data: FormData,
): Promise<FormState> => {
  let parsed;
  try {
    const formData = Object.fromEntries(data);
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

    const categoryData = await Category.findOneAndUpdate(
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

    if (categoryData) {
      revalidatePath('/categories');
      return {
        error: false,
        message: 'New category added successfully',
      };
    } else {
      return {
        error: true,
        message: 'Failed to add the new category',
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

export const getAllCategories = async (): Promise<FormState> => {
  try {
    const categoryData = await Category.find({});

    if (categoryData) {
      return {
        error: false,
        message: JSON.stringify(categoryData),
      };
    } else {
      return {
        error: true,
        message: "Couldn't retrieve categories data",
      };
    }
  } catch (error: any) {
    return {
      error: true,
      message: 'An error occurred while retrieving categories data',
    };
  }
};

export const deleteCategory = async (
  prevState: FormState,
  data: FormData,
): Promise<FormState> => {
  try {
    const categoryId = data.get('_id');

    if (!categoryId) {
      return {
        error: true,
        message: 'Category ID is required',
      };
    }

    const categoryData = await Category.findOneAndDelete({
      _id: categoryId,
    });

    if (categoryData) {
      revalidatePath('/categories');
      return {
        error: false,
        message: 'Category deleted successfully',
      };
    } else {
      return {
        error: true,
        message: 'Unable to delete the category',
      };
    }
  } catch (error: any) {
    return {
      error: true,
      message: 'An error occurred while deleting the category',
    };
  }
};

export const editCategory = async (
  prevState: FormState,
  data: FormData,
): Promise<FormState> => {
  let parsed;
  try {
    const formData = Object.fromEntries(data);
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

    let categoryId = parsed.data._id;
    delete parsed.data._id;

    if (!categoryId) {
      return {
        error: true,
        message: 'Category ID is missing',
      };
    }

    const categoryData = await Category.findByIdAndUpdate(
      categoryId,
      parsed.data,
      {
        new: true,
      },
    );

    if (categoryData) {
      revalidatePath('/categories');
      return {
        error: false,
        message: 'Category edited successfully',
        fields: categoryData.toObject(),
      };
    } else {
      return {
        error: true,
        message: 'Failed to edit the category',
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
