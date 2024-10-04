import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import { getAllInvoices } from './actions';
import Table from './components/Table';

const InvoicesPage = async () => {
  const session = await auth();
  const suppliers = await getAllInvoices({
    page: 1,
    itemsPerPage: 30,
  });
  return (
    <SessionProvider session={session}>
      <Table data={suppliers} />
    </SessionProvider>
  );
};

export default InvoicesPage;
