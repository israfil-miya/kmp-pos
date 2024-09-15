import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';
import React, { Suspense } from 'react';
import {
  getAllCategoryNames,
  getAllProducts,
  getAllStoreNames,
  getAllSupplierNames,
} from './actions';
import Table from './components/Table';

const ProductsPage = async () => {
  const session = await auth();
  const storeNames = await getAllStoreNames();
  const categoryNames = await getAllCategoryNames();
  const supplierNames = await getAllSupplierNames();
  const products = await getAllProducts({
    page: 1,
    itemsPerPage: 30,
  });

  return (
    <SessionProvider session={session}>
      <Table
        data={products}
        storeNames={storeNames}
        categoryNames={categoryNames}
        supplierNames={supplierNames}
      />
    </SessionProvider>
  );
};

export default ProductsPage;
