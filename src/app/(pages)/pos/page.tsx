'use client';

import React, { useEffect } from 'react';
import { POStContextProvider } from './POSContext';
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
            <h2 className="text-2xl font-semibold mt-4 mb-1">
              Customer Details
            </h2>
            <Customer />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mt-4 mb-1">Shopping Cart</h2>
            <Cart />
          </div>
        </div>
      </POStContextProvider>
    </>
  );
}

export default POSPage;
