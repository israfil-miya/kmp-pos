'use client';

import {
  setCalculatedZIndex,
  setClassNameAndIsDisabled,
  setMenuPortalTarget,
} from '@/utility/selectHelpers';
import { zodResolver } from '@hookform/resolvers/zod';
import 'flowbite';
import { initFlowbite } from 'flowbite';
import React, { useActionState, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import { toast } from 'sonner';
import { editExpense } from '../actions';
import { ExpenseDataTypes, validationSchema } from '../schema';

const baseZIndex = 50; // 52

interface PropsType {
  expenseData: ExpenseDataTypes;
}

const EditButton: React.FC<PropsType> = props => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const popupRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, loading] = useActionState(editExpense, {
    error: false,
    message: '',
  });

  const expenseCategories = [
    { value: 'utilities', label: 'Utilities' },
    { value: 'salaries_wages', label: 'Salaries and Wages' },
    { value: 'rent_lease', label: 'Rent and Lease' },
    { value: 'inventory_supplies', label: 'Inventory and Supplies' },
    { value: 'marketing_advertising', label: 'Marketing and Advertising' },
    { value: 'maintenance_repairs', label: 'Maintenance and Repairs' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'taxes_licensing', label: 'Taxes and Licensing' },
    { value: 'professional_services', label: 'Professional Services' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'adjustments', label: 'Adjustments' },
    { value: 'other', label: 'Other (specify in reason)' },
  ];

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(e.target as Node) &&
      !popupRef.current.querySelector('input:focus, textarea:focus') &&
      !popupRef.current.querySelector('button:focus')
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    initFlowbite();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ExpenseDataTypes>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      ...props.expenseData,
      ...(state?.fields ?? {}),
    },
  });

  useEffect(() => {
    if (state.error) {
      if (state?.message !== '') {
        toast.error(state.message);
      }
    } else if (state?.message !== '') {
      toast.success(state.message);
      if (state.fields) {
        reset(state.fields as ExpenseDataTypes);
      }
      setIsOpen(false);
    } else {
      console.log('Nothing was returned from the server');
    }
  }, [state, reset]);

  return (
    <>
      <button
        disabled={loading}
        onClick={() => {
          setIsOpen(true);
        }}
        className="items-center gap-2 rounded-sm bg-blue-600 hover:opacity-90 hover:ring-2 hover:ring-blue-600 transition duration-200 delay-300 hover:text-opacity-100 text-white p-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
          <path
            fillRule="evenodd"
            d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
          />
        </svg>
      </button>

      <section
        onClick={handleClickOutside}
        className={`fixed z-${baseZIndex} inset-0 flex justify-center items-center transition-colors ${isOpen ? 'visible bg-black/20 disable-page-scroll' : 'invisible'} `}
      >
        <article
          ref={popupRef}
          onClick={e => e.stopPropagation()}
          className={`${isOpen ? 'scale-100 opacity-100' : 'scale-125 opacity-0'} bg-white rounded-sm shadow relative md:w-[60vw] lg:w-[40vw]  text-wrap`}
        >
          <header className="flex items-center align-middle justify-between px-4 py-2 border-b rounded-t">
            <h3 className="text-gray-900 text-lg lg:text-xl font-semibold dark:text-white uppercase">
              Edit Expense
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-sm text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </header>
          <form
            action={formAction}
            ref={formRef}
            className="overflow-x-hidden overflow-y-scroll max-h-[70vh] p-4 text-start"
            onSubmit={e => {
              console.log('Form submitted');
              e.preventDefault();
              handleSubmit(() => {
                const formData = new FormData(formRef.current!);
                formData.append('_id', props.expenseData._id!);
                console.log('Form data', formData);
                formAction(formData);
              })(e);
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-4">
              <div>
                <label className="tracking-wide text-gray-700 text-sm font-bold block mb-2 ">
                  <span className="uppercase">Reason*</span>
                  <span className="text-red-700 text-wrap block text-xs">
                    {errors.reason && errors.reason.message}
                  </span>
                </label>
                <input
                  className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  {...register('reason')}
                  type="text"
                />
              </div>

              <div>
                <label className="tracking-wide text-gray-700 text-sm font-bold block mb-2 ">
                  <span className="uppercase">Amount</span>
                  <span className="text-red-700 text-wrap block text-xs">
                    {errors.amount && errors.amount.message}
                  </span>
                </label>
                <input
                  className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  {...register('amount')}
                  step=".01"
                  type="number"
                />
              </div>

              <Controller
                name="category"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      {...field}
                      {...setClassNameAndIsDisabled(
                        isOpen,
                        undefined,
                        'col-span-2',
                      )}
                      options={expenseCategories}
                      isClearable={true}
                      placeholder="Select category"
                      classNamePrefix="react-select"
                      menuPortalTarget={setMenuPortalTarget}
                      styles={setCalculatedZIndex(baseZIndex)}
                      value={
                        expenseCategories.find(
                          option => option.value === field.value,
                        ) || null
                      }
                      onChange={option =>
                        field.onChange(option ? option.value : '')
                      }
                    />
                  );
                }}
              />
            </div>
          </form>

          <footer className="flex items-center px-4 py-2 border-t justify-end gap-6 border-gray-200 rounded-b">
            <div className="buttons space-x-2 ">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-sm bg-gray-600 text-white  hover:opacity-90 hover:ring-2 hover:ring-gray-600 transition duration-200 delay-300 hover:text-opacity-100 px-4 py-2 uppercase"
                type="button"
                disabled={loading}
              >
                Close
              </button>
              <button
                disabled={loading}
                onClick={() => {
                  formRef.current?.requestSubmit();
                }}
                className="rounded-sm bg-blue-600 text-white  hover:opacity-90 hover:ring-2 hover:ring-blue-600 transition duration-200 delay-300 hover:text-opacity-100 px-4 py-2 uppercase"
                type="button"
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </footer>
        </article>
      </section>
    </>
  );
};

export default EditButton;
