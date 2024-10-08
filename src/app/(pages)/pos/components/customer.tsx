import React, { useContext, useState } from 'react';
import { CustomerType, POSContext } from '../POSContext';

const Customer: React.FC = () => {
  const context = useContext(POSContext);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { name, type, value } = e.target;

    context?.setCustomer(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
      <div className="relative">
        <input
          value={context?.customer?.name || ''}
          type="text"
          onChange={handleChange}
          name="name"
          id="floating_filled_name"
          placeholder=" "
          className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 dark:border-gray-600 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        />
        <label
          htmlFor="floating_filled_name"
          className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
        >
          Name
        </label>
      </div>
      <div className="relative">
        <input
          value={context?.customer?.phone || ''}
          type="text"
          onChange={handleChange}
          name="phone"
          id="floating_filled_phone"
          placeholder=" "
          className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 dark:border-gray-600 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        />
        <label
          htmlFor="floating_filled_phone"
          className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
        >
          Phone
        </label>
      </div>
      <div className="relative lg:col-span-2">
        <textarea
          value={context?.customer?.address || ''}
          rows={5}
          id="floating_filled_address"
          className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 dark:border-gray-600 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer resize-none"
          onChange={handleChange}
          name="address"
          placeholder=" "
        />
        <label
          htmlFor="floating_filled_address"
          className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
        >
          Address
        </label>
      </div>
    </div>
  );
};

export default Customer;
