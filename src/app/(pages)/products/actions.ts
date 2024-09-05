'use server';
import Product from '@/models/Products';
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

export const createNewProduct = async (
  prevState: FormState,
  data: FormData,
): Promise<FormState> => {
  let parsed;
  try {
    console.log('formData', data);
    const formData = parseFormData(data, ['store', 'category', 'supplier']);

    parsed = schema.safeParse(formData);

    console.log('parsed', parsed);

    if (!parsed.success) {
      console.log('parsed.error', parsed.error, 'parsed.data', parsed.data);
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
