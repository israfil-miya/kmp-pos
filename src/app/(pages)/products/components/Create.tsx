import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { YYYY_MM_DD_to_DD_MM_YY as convertToDDMMYYYY } from '@/utility/dateConversion';
import { ProductDataTypes, handleResetState } from '../helpers';
import generateUniqueCode from '@/utility/uCodeGenerator';
import 'flowbite';
import { initFlowbite } from 'flowbite';

interface PropsType {
  isLoading: boolean;
  storesList: string[];
  categoriesList: string[];
  submitHandler: (
    productData: ProductDataTypes,
    setProductData: React.Dispatch<React.SetStateAction<ProductDataTypes>>,
  ) => Promise<void>;
}

const CreateButton: React.FC<PropsType> = props => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data: session } = useSession();
  const popupRef = useRef<HTMLElement>(null);
  const [productData, setProductData] = useState<ProductDataTypes>({});

  useEffect(() => {
    initFlowbite();
  }, []);

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
        [name]: value,
      }));
    }
  };

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(e.target as Node) &&
      !popupRef.current.querySelector('input:focus, textarea:focus')
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
                <label className="uppercase tracking-wide text-gray-700 text-sm font-bold block mb-2">
                  Name*
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  name="name"
                  value={productData.name}
                  onChange={handleChange}
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
                    className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 py-1"
                  >
                    <ul
                      aria-labelledby="storesDropdown"
                      className="text-sm text-gray-700 dark:text-gray-200 overflow-auto max-h-28"
                    >
                      {props.storesList.map((store, index) => (
                        <li key={index} className="flex items-center py-1 px-3">
                          <input
                            className="form-check-input mr-2 h-4 w-4 border border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                            type="checkbox"
                            name="store"
                            value={store}
                            id={`checkbox${index}`}
                            checked={productData.store?.includes(store)}
                            onChange={handleChange}
                          />
                          <label
                            className="form-check-label text-gray-700"
                            htmlFor={`checkbox${index}`}
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
                    className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 py-1"
                  >
                    <ul
                      aria-labelledby="categoriesDropdown"
                      className="text-sm text-gray-700 dark:text-gray-200 overflow-auto max-h-28"
                    >
                      {props.categoriesList.map((category, index) => (
                        <li key={index} className="flex items-center py-1 px-3">
                          <input
                            className="form-check-input mr-2 h-4 w-4 border border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                            type="checkbox"
                            name="category"
                            value={category}
                            id={`checkbox${index}`}
                            checked={productData.category?.includes(category)}
                            onChange={handleChange}
                          />
                          <label
                            className="form-check-label text-gray-700"
                            htmlFor={`checkbox${index}`}
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
                    type="text"
                    className="flex-grow appearance-none block w-full rounded-s-none bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Add stores by selecting from dropdown"
                    value={productData.store?.join('+') || ''}
                  />
                </div>
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
