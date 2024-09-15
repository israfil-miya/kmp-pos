'use server';
import Store from '@/models/Stores';
import User from '@/models/Users';
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

export const createNewUser = async (
  prevState: FormState,
  data: FormData,
): Promise<FormState> => {
  let parsed;
  try {
    const formData = Object.fromEntries(data);
    parsed = schema.safeParse(formData);

    console.log(formData, parsed?.data);

    if (!parsed.success) {
      const fields = mapFormDataToFields(formData);
      return {
        error: true,
        message: 'Invalid form data',
        fields,
        issues: parsed.error.issues.map(issue => issue.message),
      };
    }

    const userData = await User.findOneAndUpdate(
      {
        email: parsed.data.email,
      },
      parsed.data,
      {
        upsert: true,
        new: true,
        runValidators: true, // Ensures validation rules are applied
      },
    );

    if (userData) {
      revalidatePath('/users');
      return {
        error: false,
        message: 'New user added successfully',
      };
    } else {
      return {
        error: true,
        message: 'Failed to add the new user',
        fields: parsed.data,
      };
    }
  } catch (error: any) {
    // MongoDB validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      console.log('ERROR: ', error);
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

export const getAllUsers = async (): Promise<FormState> => {
  try {
    const userData = await User.find({});

    if (userData) {
      return {
        error: false,
        message: JSON.stringify(userData),
      };
    } else {
      return {
        error: true,
        message: "Couldn't retrieve users data",
      };
    }
  } catch (error: any) {
    return {
      error: true,
      message: 'An error occurred while retrieving users data',
    };
  }
};

export const deleteUser = async (
  prevState: FormState,
  data: FormData,
): Promise<FormState> => {
  try {
    const userId = data.get('_id');

    if (!userId) {
      return {
        error: true,
        message: 'User ID is required',
      };
    }

    const userData = await User.findOneAndDelete({
      _id: userId,
    });

    if (userData) {
      revalidatePath('/users');
      return {
        error: false,
        message: 'User deleted successfully',
      };
    } else {
      return {
        error: true,
        message: 'Unable to delete the user',
      };
    }
  } catch (error: any) {
    return {
      error: true,
      message: 'An error occurred while deleting the user',
    };
  }
};

export const editUser = async (
  prevState: FormState,
  data: FormData,
): Promise<FormState> => {
  let parsed;
  try {
    const formData = Object.fromEntries(data);
    parsed = schema.safeParse(formData);

    console.log(formData, parsed?.data);

    if (!parsed.success) {
      const fields = mapFormDataToFields(formData);
      return {
        error: true,
        message: 'Invalid form data',
        fields,
        issues: parsed.error.issues.map(issue => issue.message),
      };
    }

    let userId = parsed.data._id;
    delete parsed.data._id;

    if (!userId) {
      return {
        error: true,
        message: 'User ID is missing',
      };
    }

    const userData = await User.findByIdAndUpdate(userId, parsed.data, {
      new: true,
    });

    if (userData) {
      revalidatePath('/users');
      return {
        error: false,
        message: 'User edited successfully',
        fields: userData.toObject(),
      };
    } else {
      return {
        error: true,
        message: 'Failed to edit the user',
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
