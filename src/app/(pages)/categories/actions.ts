'use server';
import fetchData from '@/utility/fetchData';
import { revalidatePath } from 'next/cache';
import { RefObject } from 'react';
import { validationSchema as schema } from './schema';

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export const createNewCategory = async (
  prevState: FormState,
  data: FormData,
): Promise<FormState> => {
  try {
    const formData = Object.fromEntries(data);
    const parsed = schema.safeParse(formData);

    if (!parsed.success) {
      const fields: Record<string, string> = {};
      for (const key of Object.keys(formData)) {
        fields[key] = formData[key].toString();
      }
      return {
        message: 'Invalid form data',
        fields,
        issues: parsed.error.issues.map(issue => issue.message),
      };
    }

    let url: string =
      process.env.NEXT_PUBLIC_BASE_URL +
      '/api/category?action=create-new-category';
    let options: {} = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    let response = await fetchData(url, options);

    if (response.ok) {
      revalidatePath('/categories');
      return {
        message: 'New category added successfully',
        fields: parsed.data,
      };
    } else {
      return { message: response.data as string, fields: parsed.data };
    }
  } catch (error) {
    console.error(error);
    return { message: 'An error occurred while submitting the form' };
  }
};
