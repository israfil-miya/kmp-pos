'use server';
import Store from '@/models/Stores';
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

export const createNewStore = async (
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

    const storeData = await Store.findOneAndUpdate(
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

    if (storeData) {
      revalidatePath('/stores');
      return {
        error: false,
        message: 'New store added successfully',
      };
    } else {
      return {
        error: true,
        message: 'Failed to add the new store',
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

export const getAllStores = async (): Promise<FormState> => {
  try {
    const storeData = await Store.find({});

    if (storeData) {
      return {
        error: false,
        message: JSON.stringify(storeData),
      };
    } else {
      return {
        error: true,
        message: "Couldn't retrieve stores data",
      };
    }
  } catch (error: any) {
    return {
      error: true,
      message: 'An error occurred while retrieving stores data',
    };
  }
};

export const deleteStore = async (
  prevState: FormState,
  data: FormData,
): Promise<FormState> => {
  try {
    const storeId = data.get('_id');

    if (!storeId) {
      return {
        error: true,
        message: 'Store ID is required',
      };
    }

    const storeData = await Store.findOneAndDelete({
      _id: storeId,
    });

    if (storeData) {
      revalidatePath('/stores');
      return {
        error: false,
        message: 'Store deleted successfully',
      };
    } else {
      return {
        error: true,
        message: 'Unable to delete the store',
      };
    }
  } catch (error: any) {
    return {
      error: true,
      message: 'An error occurred while deleting the store',
    };
  }
};

export const editStore = async (
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

    let storeId = parsed.data._id;
    delete parsed.data._id;

    if (!storeId) {
      return {
        error: true,
        message: 'Store ID is missing',
      };
    }

    const storeData = await Store.findByIdAndUpdate(storeId, parsed.data, {
      new: true,
    });

    if (storeData) {
      revalidatePath('/stores');
      return {
        error: false,
        message: 'Store edited successfully',
        fields: storeData.toObject(),
      };
    } else {
      return {
        error: true,
        message: 'Failed to edit the store',
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
