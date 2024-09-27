'use client';

import React, { useEffect } from 'react';
import { POStContextProvider } from './POSContext';
import SearchInput from './components/search';

function POSPage() {
  return (
    <>
      <POStContextProvider>
        <SearchInput />
      </POStContextProvider>
    </>
  );
}

export default POSPage;
