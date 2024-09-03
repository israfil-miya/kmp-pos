'use client';

import generateUniqueCode from '@/utility/uCodeGenerator';
import 'flowbite';
import { initFlowbite } from 'flowbite';
import React, { useActionState, useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { useDebouncedCallback } from 'use-debounce';
import { handleResetState } from '../helpers';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { createNewProduct } from '../actions';
import { ProductDataTypes, validationSchema } from '../schema';

interface PropsType {
  isLoading: boolean;
  storesList: string[];
  categoriesList: string[];
  suppliersList: string[];
  submitHandler: (
    productData: ProductDataTypes,
    setProductData: React.Dispatch<React.SetStateAction<ProductDataTypes>>,
  ) => Promise<void>;
}

const CreateButton: React.FC<PropsType> = props => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const popupRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, loading] = useActionState(createNewProduct, {
    error: false,
    message: '',
  });

  useEffect(() => {
    initFlowbite();
  }, []);

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

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<ProductDataTypes>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      batch: '',
      name: '',
      description: '',
      cost_price: 0,
      selling_price: 0,
      quantity: 0,
      supplier: [],
      category: [],
      store: [],
      mft_date: '',
      exp_date: '',
      ...(state?.fields ?? {}),
    },
  });

  const nameValue = watch('name');

  const storeOptions = props.storesList.map(store => ({
    value: store,
    label: store.charAt(0).toUpperCase() + store.slice(1),
  }));

  const categoryOptions = props.categoriesList.map(category => ({
    value: category,
    label: category.charAt(0).toUpperCase() + category.slice(1),
  }));

  const supplierOptions = props.suppliersList.map(supplier => ({
    value: supplier,
    label: supplier.charAt(0).toUpperCase() + supplier.slice(1),
  }));

  // Debounced batch generation
  const debouncedGenerateBatch = useDebouncedCallback((value: string) => {
    if (value) {
      const generatedBatchCode = generateUniqueCode(value);
      setValue('batch', generatedBatchCode);
    } else {
      setValue('batch', '');
    }
  }, 1500);

  useEffect(() => {
    debouncedGenerateBatch(nameValue);
  }, [nameValue, debouncedGenerateBatch]);
  return (
    <>
      <button
        disabled={loading}
        onClick={() => {
          setIsOpen(true);
        }}
        className="items-center flex gap-2 rounded-sm bg-green-600 hover:opacity-90 hover:ring-2 hover:ring-green-600 transition duration-200 delay-300 hover:text-opacity-100 text-white py-2 px-3"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
        </svg>
        Add Product
      </button>

      <section
        onClick={handleClickOutside}
        className={`fixed z-50 inset-0 flex justify-center items-center transition-colors ${isOpen ? 'visible bg-black/20 disable-page-scroll' : 'invisible'} `}
      >
        <article
          ref={popupRef}
          onClick={e => e.stopPropagation()}
          className={`${isOpen ? 'scale-100 opacity-100' : 'scale-125 opacity-0'} bg-white rounded-sm shadow relative md:w-[60vw] lg:w-[40vw]  text-wrap`}
        >
          <header className="flex items-center align-middle justify-between px-4 py-2 border-b rounded-t">
            <h3 className="text-gray-900 text-lg lg:text-xl font-semibold uppercase">
              Create New Product
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-sm text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="default-modal"
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
              e.preventDefault();
              handleSubmit(() => {
                formAction(new FormData(formRef.current!));
              })(e);
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-4">
              <div>
                <label className="uppercase tracking-wide text-gray-700 text-sm font-bold flex items-center gap-2 mb-2">
                  Batch*{' '}
                  <span className="cursor-pointer has-tooltip text-xs">
                    &#9432;
                    <span className="tooltip italic font-medium rounded-sm text-xs shadow-lg p-1 px-2 bg-gray-100 ml-2">
                      Auto generated
                    </span>
                  </span>
                </label>
                <input
                  {...register('batch')}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="text"
                  required
                  disabled
                />
              </div>

              <div>
                <label className="uppercase tracking-wide text-gray-700 text-sm font-bold block mb-2">
                  Name*
                </label>
                <input
                  {...register('name')}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="text"
                  required
                />
              </div>

              <div>
                <label className="uppercase tracking-wide text-gray-700 text-sm font-bold block mb-2">
                  Store*
                </label>

                <Controller
                  name="store"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={storeOptions}
                      isMulti
                      closeMenuOnSelect={false}
                      placeholder="Select stores"
                      className="flex-grow text-nowrap py-3 px-3 appearance-none border border-gray-200 rounded-sm leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      classNamePrefix="react-select"
                      // Map selected values back to the option objects
                      value={storeOptions.filter(option =>
                        field.value.includes(option.value),
                      )}
                      onChange={selectedOptions =>
                        field.onChange(
                          selectedOptions.map(option => option.value),
                        )
                      }
                    />
                  )}
                />
              </div>

              <div>
                <label className="uppercase tracking-wide text-gray-700 text-sm font-bold block mb-2">
                  Category*
                </label>

                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={categoryOptions}
                      isMulti
                      closeMenuOnSelect={false}
                      placeholder="Select categories"
                      className="flex-grow text-nowrap py-3 px-3 appearance-none border border-gray-200 rounded-sm leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      classNamePrefix="react-select"
                      // Map selected values back to the option objects
                      value={categoryOptions.filter(option =>
                        field.value.includes(option.value),
                      )}
                      onChange={selectedOptions =>
                        field.onChange(
                          selectedOptions.map(option => option.value),
                        )
                      }
                    />
                  )}
                />
              </div>

              <div>
                <label className="uppercase tracking-wide text-gray-700 text-sm font-bold block mb-2">
                  Supplier*
                </label>

                <Controller
                  name="supplier"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={supplierOptions}
                      isMulti
                      closeMenuOnSelect={false}
                      placeholder="Select suppliers"
                      className="flex-grow text-nowrap py-3 px-3 appearance-none border border-gray-200 rounded-sm leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      classNamePrefix="react-select"
                      // Map selected values back to the option objects
                      value={supplierOptions.filter(option =>
                        field.value.includes(option.value),
                      )}
                      onChange={selectedOptions =>
                        field.onChange(
                          selectedOptions.map(option => option.value),
                        )
                      }
                    />
                  )}
                />
              </div>

              <div>
                <label className="uppercase tracking-wide text-gray-700 text-sm font-bold block mb-2">
                  Quantity*
                </label>
                <input
                  {...register('quantity')}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="number"
                  required
                />
              </div>

              <div>
                <label className="uppercase tracking-wide text-gray-700 text-sm font-bold block mb-2">
                  Cost Price*
                </label>
                <input
                  {...register('cost_price')}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="number"
                  required
                />
              </div>

              <div>
                <label className="uppercase tracking-wide text-gray-700 text-sm font-bold block mb-2">
                  Selling Price
                </label>
                <input
                  {...register('selling_price')}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="number"
                  required
                />
              </div>

              <div>
                <label className="uppercase tracking-wide text-gray-700 text-sm font-bold block mb-2">
                  Mft. Date
                </label>
                <input
                  {...register('mft_date')}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="date"
                />
              </div>

              <div>
                <label className="uppercase tracking-wide text-gray-700 text-sm font-bold block mb-2">
                  Exp. Date
                </label>
                <input
                  {...register('exp_date')}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="date"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={5}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  placeholder="What's the product about?"
                />
              </div>
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

export default CreateButton;
