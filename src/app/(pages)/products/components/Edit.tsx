import { useSession } from 'next-auth/react';

import 'flowbite';
import { initFlowbite } from 'flowbite';
import React, { useEffect, useRef, useState } from 'react';
import { ProductDataTypes, handleResetState } from '../helpers';

interface PropsType {
  productData: ProductDataTypes;
  storesList: string[];
  categoriesList: string[];
  suppliersList: string[];
  isLoading: boolean;
  submitHandler: (
    productId: string | undefined,
    productData: ProductDataTypes,
    editedData: ProductDataTypes,
    setEditedData: React.Dispatch<React.SetStateAction<ProductDataTypes>>,
  ) => Promise<void>;
}

const EditButton: React.FC<PropsType> = props => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data: session } = useSession();
  const popupRef = useRef<HTMLElement>(null);

  const [editedData, setEditedData] = useState<ProductDataTypes>({});

  useEffect(() => {
    initFlowbite();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      handleResetState(setEditedData);
    } else {
      setEditedData(props.productData);
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setEditedData((prevData: ProductDataTypes) => {
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
      setEditedData(prevData => ({
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
        className={`fixed z-50 inset-0 flex justify-center items-center transition-colors ${isOpen ? 'visible bg-black/20 disable-page-scroll' : 'invisible'} `}
      >
        <article
          ref={popupRef}
          onClick={e => e.stopPropagation()}
          className={`${isOpen ? 'scale-100 opacity-100' : 'scale-125 opacity-0'} bg-white rounded-sm shadow relative md:w-[60vw] lg:w-[40vw]  text-wrap`}
        >
          <header className="flex items-center align-middle justify-between px-4 py-2 border-b rounded-t">
            <h3 className="text-gray-900 text-lg lg:text-xl font-semibold dark:text-white uppercase">
              Edit Product
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
          <div className="overflow-x-hidden overflow-y-scroll max-h-[70vh] p-4 text-start">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-4">
              <div>
                <label className="uppercase tracking-wide text-gray-700 text-sm font-bold block mb-2">
                  Batch*
                </label>
                <input
                  required
                  disabled
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  // name="batch"
                  value={editedData.batch}
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
                  value={editedData.name}
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
                    id="storesEditDropdown"
                    data-dropdown-toggle="dropdown4"
                    className="dropdown-toggle flex-grow text-nowrap py-3 px-3 rounded-e-none appearance-none border border-gray-200 rounded-sm leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="button"
                  >
                    Select
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    id="dropdown4"
                    className="z-10 hidden bg-white divide-y divide-gray-100 rounded-sm shadow dark:bg-gray-700 py-2.5"
                  >
                    <ul
                      aria-labelledby="storesEditDropdown"
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
                            checked={editedData.store?.includes(store)}
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
                    value={editedData.store?.join('+') || ''}
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
                    id="categoriesEditDropdown"
                    data-dropdown-toggle="dropdown5"
                    className="dropdown-toggle flex-grow text-nowrap py-3 px-3 rounded-e-none appearance-none border border-gray-200 rounded-sm leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="button"
                  >
                    Select
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    id="dropdown5"
                    className="z-10 hidden bg-white divide-y divide-gray-100 rounded-sm shadow dark:bg-gray-700 py-2.5"
                  >
                    <ul
                      aria-labelledby="categoriesEditDropdown"
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
                            checked={editedData.category?.includes(category)}
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
                    value={editedData.category?.join('+') || ''}
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
                    id="suppliersEditDropdown"
                    data-dropdown-toggle="dropdown6"
                    className="dropdown-toggle flex-grow text-nowrap py-3 px-3 rounded-e-none appearance-none border border-gray-200 rounded-sm leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="button"
                  >
                    Select
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    id="dropdown6"
                    className="z-10 hidden bg-white divide-y divide-gray-100 rounded-sm shadow dark:bg-gray-700 py-2.5"
                  >
                    <ul
                      aria-labelledby="suppliersEditDropdown"
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
                            checked={editedData.supplier?.includes(supplier)}
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
                    value={editedData.supplier?.join('+') || ''}
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
                  value={editedData.quantity}
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
                  value={editedData.cost_price}
                  onChange={handleChange}
                  type="number"
                  required
                />
              </div>

              <div>
                <label className="uppercase tracking-wide text-gray-700 text-sm font-bold block mb-2">
                  Selling Price
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  name="selling_price"
                  value={editedData.selling_price}
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
                  value={editedData.mft_date}
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
                  value={editedData.exp_date}
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
                  value={editedData.description}
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
                className="rounded-sm bg-gray-600 text-white  hover:opacity-90 hover:ring-2 hover:ring-gray-600 transition duration-200 delay-300 hover:text-opacity-100 px-4 py-2 uppercase"
                type="button"
              >
                Close
              </button>
              <button
                onClick={() => {
                  props.submitHandler(
                    props.productData?._id,
                    props.productData,
                    editedData,
                    setEditedData,
                  );
                  setIsOpen(false);
                }}
                className="rounded-sm bg-blue-600 text-white  hover:opacity-90 hover:ring-2 hover:ring-blue-600 transition duration-200 delay-300 hover:text-opacity-100 px-4 py-2 uppercase"
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

export default EditButton;
