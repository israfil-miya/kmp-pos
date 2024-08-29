import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import { getAllCategories } from './actions';
import Table from './components/Table';

const CategoriesPage = async () => {
  const session = await auth();
  const categories = await getAllCategories();
  return (
    <SessionProvider session={session}>
      <Table data={categories} />
    </SessionProvider>
  );
};

export default CategoriesPage;
