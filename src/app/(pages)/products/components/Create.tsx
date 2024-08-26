'use client';

import generateUniqueCode from '@/utility/uCodeGenerator';
import 'flowbite';
import { initFlowbite } from 'flowbite';
import React, { useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { ProductDataTypes, handleResetState } from '../helpers';

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
  const [productData, setProductData] = useState<ProductDataTypes>({});

  useEffect(() => {
    initFlowbite();
  }, []);

  const debouncedBatch = useDebouncedCallback(value => {
    if (!value) {
      setProductData(prevData => ({ ...prevData, batch: '' }));
      return;
    }
    let generatedBatch = generateUniqueCode(value);
    setProductData(prevData => ({ ...prevData, batch: generatedBatch }));
  }, 1500);

  useEffect(() => {
    if (!isOpen) {
      handleResetState(setProductData);
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setProductData((prevData: ProductDataTypes) => {
        const currentValues =
          (prevData[name as keyof ProductDataTypes] as string[]) || [];

        return {
          ...prevData,
          [name as keyof ProductDataTypes]: currentValues.includes(value)
            ? currentValues.filter(s => s !== value)
            : [...currentValues, value],
        };
      });
    } else {
      setProductData(prevData => ({
        ...prevData,
        [name]: type === 'number' ? +value : value,
      }));
    }
  };

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

  return (
    <>
      <button
        disabled={props.isLoading}
        onClick={() => {
          setIsOpen(true);
        }}
        className="items-center flex gap-2 rounded-md bg-green-600 hover:opacity-90 hover:ring-2 hover:ring-green-600 transition duration-200 delay-300 hover:text-opacity-100 text-white py-2 px-3"
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
          className={`${isOpen ? 'scale-100 opacity-100' : 'scale-125 opacity-0'} bg-white rounded-lg shadow relative md:w-[60vw] lg:w-[40vw]  text-wrap`}
        >
          <header className="flex items-center align-middle justify-between px-4 py-2 border-b rounded-t">
            <h3 className="text-gray-900 text-lg lg:text-xl font-semibold uppercase">
              Create New Product
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
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

          <div className="overflow-x-hidden overflow-y-scroll max-h-[70vh] p-4 text-start">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-4">
              <div>
                <label className="uppercase tracking-wide text-gray-700 text-sm font-bold flex items-center gap-2 mb-2">
                  Batch*{' '}
                  <span className="cursor-pointer has-tooltip text-xs">
                    &#9432;
                    <span className="tooltip italic font-medium rounded-md text-xs shadow-lg p-1 px-2 bg-gray-100 ml-2">
                      Auto generated
                    </span>
                  </span>
                </label>
                <input
                  required
                  disabled
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  // name="batch"
                  value={productData.batch}
                  // onChange={handleChange}
                  type="text"
                />
              </div>

              <div>
                <label className="uppercase tracking-wide text-gray-700 text-sm font-bold block mb-2">
                  Name*
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  name="name"
                  value={productData.name}
                  onChange={e => {
                    handleChange(e);
                    debouncedBatch(e.target.value);
                  }}
                  type="text"
                  required
                />
              </div>

              <div>
                <label className="uppercase tracking-wide text-gray-700 text-sm font-bold block mb-2">
                  Store*
                </label>

                <div className="flex items-center space-x-0">
                  {/* Dropdown Button */}
                  <button
                    id="storesDropdown"
                    data-dropdown-toggle="dropdown1"
                    className="dropdown-toggle flex-grow text-nowrap py-3 px-3 rounded-e-none appearance-none border border-gray-200 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="button"
                  >
                    Select
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    id="dropdown1"
                    className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 py-2.5"
                  >
                    <ul
                      aria-labelledby="storesDropdown"
                      className="text-sm text-gray-700 capitalize dark:text-gray-200 overflow-auto max-h-28"
                    >
                      {props.storesList.map((store, index) => (
                        <li
                          key={`${store}_${index}`}
                          className="flex items-center py-1 px-3"
                        >
                          <input
                            className="form-check-input cursor-pointer mr-2 h-4 w-4 border border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                            type="checkbox"
                            name="store"
                            value={store}
                            id={`checkbox_edit_${store}_${index}`}
                            checked={productData.store?.includes(store)}
                            onChange={handleChange}
                          />
                          <label
                            className="form-check-label cursor-pointer select-none text-gray-700"
                            htmlFor={`checkbox_edit_${store}_${index}`}
                          >
                            {store}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Input Field */}
                  <input
                    disabled
                    required
                    type="text"
                    className="flex-grow appearance-none block w-full rounded-s-none bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Add stores by selecting from dropdown"
                    value={productData.store?.join('+') || ''}
                  />
                </div>
              </div>

              <div>
                <label className="uppercase tracking-wide text-gray-700 text-sm font-bold block mb-2">
                  Category*
                </label>

                <div className="flex items-center space-x-0">
                  {/* Dropdown Button */}
                  <button
                    id="categoriesDropdown"
                    data-dropdown-toggle="dropdown2"
                    className="dropdown-toggle flex-grow text-nowrap py-3 px-3 rounded-e-none appearance-none border border-gray-200 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="button"
                  >
                    Select
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    id="dropdown2"
                    className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 py-2.5"
                  >
                    <ul
                      aria-labelledby="categoriesDropdown"
                      className="text-sm text-gray-700 capitalize dark:text-gray-200 overflow-auto max-h-28"
                    >
                      {props.categoriesList.map((category, index) => (
                        <li
                          key={`${category}_${index}`}
                          className="flex items-center py-1 px-3"
                        >
                          <input
                            className="form-check-input cursor-pointer mr-2 h-4 w-4 border border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                            type="checkbox"
                            name="category"
                            value={category}
                            id={`checkbox_edit_${category}_${index}`}
                            checked={productData.category?.includes(category)}
                            onChange={handleChange}
                          />
                          <label
                            className="form-check-label cursor-pointer select-none text-gray-700"
                            htmlFor={`checkbox_edit_${category}_${index}`}
                          >
                            {category}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Input Field */}
                  <input
                    disabled
                    required
                    type="text"
                    className="flex-grow appearance-none block w-full rounded-s-none bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Add categories by selecting from dropdown"
                    value={productData.category?.join('+') || ''}
                  />
                </div>
              </div>

              <div>
                <label className="uppercase tracking-wide text-gray-700 text-sm font-bold block mb-2">
                  Supplier*
                </label>

                <div className="flex items-center space-x-0">
                  {/* Dropdown Button */}
                  <button
                    id="suppliersDropdown"
                    data-dropdown-toggle="dropdown3"
                    className="dropdown-toggle flex-grow text-nowrap py-3 px-3 rounded-e-none appearance-none border border-gray-200 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="button"
                  >
                    Select
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    id="dropdown3"
                    className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 py-2.5"
                  >
                    <ul
                      aria-labelledby="suppliersDropdown"
                      className="text-sm text-gray-700 capitalize dark:text-gray-200 overflow-auto max-h-28"
                    >
                      {props.suppliersList.map((supplier, index) => (
                        <li
                          key={`${supplier}_${index}`}
                          className="flex items-center py-1 px-3"
                        >
                          <input
                            className="form-check-input cursor-pointer mr-2 h-4 w-4 border border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                            type="checkbox"
                            name="supplier"
                            value={supplier}
                            id={`checkbox_edit_${supplier}_${index}`}
                            checked={productData.supplier?.includes(supplier)}
                            onChange={handleChange}
                          />
                          <label
                            className="form-check-label cursor-pointer select-none text-gray-700"
                            htmlFor={`checkbox_edit_${supplier}_${index}`}
                          >
                            {supplier}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Input Field */}
                  <input
                    required
                    disabled
                    type="text"
                    className="flex-grow appearance-none block w-full rounded-s-none bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Add suppliers by selecting from dropdown"
                    value={productData.supplier?.join('+') || ''}
                  />
                </div>
              </div>

              <div>
                <label className="uppercase tracking-wide text-gray-700 text-sm font-bold block mb-2">
                  Quantity*
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  name="quantity"
                  value={productData.quantity}
                  onChange={handleChange}
                  type="number"
                  required
                />
              </div>
              <div>
                <label className="uppercase tracking-wide text-gray-700 text-sm font-bold block mb-2">
                  Cost Price*
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  name="cost_price"
                  value={productData.cost_price}
                  onChange={handleChange}
                  type="number"
                  required
                />
              </div>

              <div>
                <label className="uppercase tracking-wide text-gray-700 text-sm font-bold flex items-center gap-2 mb-2">
                  Selling Price
                  <span className="cursor-pointer text-xs has-tooltip">
                    &#9432;
                    <span className="tooltip italic font-medium rounded-md text-xs shadow-lg p-1 px-2 bg-gray-100 ml-2">
                      Default to cost price if not given
                    </span>
                  </span>
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  name="selling_price"
                  value={productData.selling_price}
                  onChange={handleChange}
                  type="number"
                />
              </div>

              <div>
                <label className="uppercase tracking-wide text-gray-700 text-sm font-bold block mb-2">
                  Mft. Date
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  name="mft_date"
                  value={productData.mft_date}
                  onChange={handleChange}
                  type="date"
                />
              </div>

              <div>
                <label className="uppercase tracking-wide text-gray-700 text-sm font-bold block mb-2">
                  Exp. Date
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  name="exp_date"
                  value={productData.exp_date}
                  onChange={handleChange}
                  type="date"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  rows={5}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  name="description"
                  value={productData.description}
                  onChange={handleChange}
                  placeholder="What's the product about?"
                />
              </div>
            </div>
          </div>

          <footer className="flex items-center px-4 py-2 border-t justify-end gap-6 border-gray-200 rounded-b">
            <div className="buttons space-x-2 ">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-md bg-gray-600 text-white  hover:opacity-90 hover:ring-2 hover:ring-gray-600 transition duration-200 delay-300 hover:text-opacity-100 px-8 py-2 uppercase"
                type="button"
              >
                Close
              </button>
              <button
                onClick={() => {
                  props.submitHandler(productData, setProductData);
                  setIsOpen(false);
                }}
                className="rounded-md bg-blue-600 text-white  hover:opacity-90 hover:ring-2 hover:ring-blue-600 transition duration-200 delay-300 hover:text-opacity-100 px-8 py-2 uppercase"
                type="button"
              >
                Submit
              </button>
            </div>
          </footer>
        </article>
      </section>
    </>
  );
};

export default CreateButton;
