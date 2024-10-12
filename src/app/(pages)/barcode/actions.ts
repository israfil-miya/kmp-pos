'use server';
import Product from '@/models/Products';
import dbConnect from '@/utility/dbConnect';

export type FormState = {
  error: boolean;
  message: string;
  fields?: Record<any, any>;
  issues?: string[];
};

dbConnect();

export const getProductByBatchCode = async (
  code: string,
): Promise<FormState> => {
  try {
    const productData = await Product.findOne({ batch: code });

    if (productData) {
      return {
        error: false,
        message: JSON.stringify(productData),
      };
    } else {
      return {
        error: true,
        message: "The product doesn't exist in the database",
      };
    }
  } catch (error: any) {
    return {
      error: true,
      message: 'An error occurred while retrieving product data',
    };
  }
};
