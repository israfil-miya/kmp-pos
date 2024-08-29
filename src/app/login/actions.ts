'use server';
import { mapFormDataToFields } from '@/utility/actionHelpers';
import dbConnect from '@/utility/dbConnect';
import { signIn } from 'next-auth/react';
import { revalidatePath } from 'next/cache';
import { validationSchema as schema } from './schema';
dbConnect();

export type FormState = {
  error: boolean;
  message: string;
  fields?: Record<string, string | number>;
  issues?: string[];
};

export const handleSignIn = async (
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

    const result = await signIn('credentials', {
      redirect: false,
      email: parsed.data.email,
      password: parsed.data.password,
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    });

    if (result?.ok) {
      revalidatePath('/login');
      return {
        error: false,
        message: 'Logged in successfully',
      };
    } else {
      if (result?.error === 'CredentialsSignin') {
        return {
          error: true,
          message: 'Invalid email or password',
          fields: parsed?.data,
        };
      } else {
        return {
          error: true,
          message: 'An error occurred',
          fields: parsed?.data,
        };
      }
    }
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: 'An error occurred while submitting the form',
      fields: parsed?.data,
    };
  }
};
