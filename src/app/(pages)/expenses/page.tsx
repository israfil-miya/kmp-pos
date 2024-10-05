import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import { getAllSuppliers } from './actions';
import Table from './components/Table';

const SuppliersPage = async () => {
  const session = await auth();
  const suppliers = await getAllSuppliers({
    page: 1,
    itemsPerPage: 30,
  });
  return (
    <SessionProvider session={session}>
      <Table data={suppliers} />
    </SessionProvider>
  );
};

export default SuppliersPage;
