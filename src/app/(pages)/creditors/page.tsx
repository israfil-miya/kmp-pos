import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import { getAllCreditors } from './actions';
import Table from './components/Table';

const InvoicesPage = async () => {
  const session = await auth();
  const products = await getAllCreditors({
    page: 1,
    itemsPerPage: 30,
  });
  return (
    <SessionProvider session={session}>
      <Table data={products} />
    </SessionProvider>
  );
};

export default InvoicesPage;
