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
        <div className="gap-1 lg:flex-row flex flex-col lg:h-[calc(100vh-120px)]">
          <div className="border-2 rounded-sm p-4 w-full overflow-auto lg:h-full">
            <div>
              <h2 className="text-2xl font-semibold mb-1">Product Search</h2>
              <SearchInput />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mt-4 mb-1">
                Shopping Cart
              </h2>
              <Cart />
            </div>
          </div>
          <div className="lg:w-[40vw] w-full border-2 rounded-sm p-4 overflow-auto lg:h-full">
            <div className="flex flex-col md:flex-col gap-8 w-full">
              <div className="w-full">
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
      </POStContextProvider>
    </>
  );
}

export default POSPage;
