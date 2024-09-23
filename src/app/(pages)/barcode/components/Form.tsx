'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { handleBarcodeDownload } from '../../products/components/Barcode';
import { ProductDataTypes } from '../../products/schema';
import { getProductByBatchCode } from '../actions';

const validationSchema = z.object({
  code: z.string().length(8, 'Batch Code must be 8 characters'),
});

type InputTypes = z.infer<typeof validationSchema>;

function Form() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InputTypes>({
    resolver: zodResolver(validationSchema),
    defaultValues: { code: '' },
  });

  const handleFormSubmit = async () => {
    try {
      const { code } = watch();
      setLoading(true);

      const response = await getProductByBatchCode(code);

      if (response.error) {
        handleBarcodeDownload(code, setLoading);
      } else {
        const productData: ProductDataTypes = JSON.parse(response.message);

        console.log('productData', productData);

        handleBarcodeDownload(
          productData.batch,
          setLoading,
          productData.name,
          productData.selling_price,
        );
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to download barcode');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="w-full max-w-3xl mx-auto my-8"
    >
      <div className="flex flex-col sm:flex-row w-full items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-grow w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="h-5 w-5 text-gray-400"
            >
              <path d="M3 5v14" />
              <path d="M8 5v14" />
              <path d="M12 5v14" />
              <path d="M17 5v14" />
              <path d="M21 5v14" />
            </svg>
          </div>
          <input
            {...register('code', { required: 'Batch Code is required' })}
            className="w-full pl-10 py-2.5 px-4 appearance-none block bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            placeholder="Enter Batch Code"
            type="text"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-sm bg-blue-600 text-white hover:opacity-90 hover:ring-2 hover:ring-blue-600 transition duration-200 delay-300 hover:text-opacity-100 px-4 py-2"
        >
          {loading ? 'Generating...' : 'Download'}
        </button>
      </div>
      {errors.code && (
        <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>
      )}
    </form>
  );
}

export default Form;
