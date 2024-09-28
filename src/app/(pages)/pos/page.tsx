'use client';

import React, { useEffect } from 'react';
import { POStContextProvider } from './POSContext';
import Billing from './components/billing';
import Cart from './components/cart';
import Customer from './components/customer';
import SearchInput from './components/search';

function POSPage() {
  return (
    <>
      <POStContextProvider>
        <div className="gap-4 flex flex-col">
          <div>
            <h2 className="text-2xl font-semibold mb-1">Product Search</h2>
            <SearchInput />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mt-4 mb-1">Shopping Cart</h2>
            <Cart />
          </div>
          <div className="w-full">
            <div className="flex flex-col md:flex-row w-full gap-8">
              <div className="w-full md:w-[40vw]">
                <h2 className="text-2xl font-semibold mt-4 mb-1">
                  Customer Details
                </h2>
                <Customer />
              </div>
              <div className="w-full md:flex-1">
                <h2 className="text-2xl font-semibold mt-4 mb-1">
                  Bill Details
                </h2>
                <Billing />
              </div>
            </div>
          </div>
        </div>
        <button>PAY THE BILL</button>
      </POStContextProvider>
    </>
  );
}

export default POSPage;
