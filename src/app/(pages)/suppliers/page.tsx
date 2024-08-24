import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import Table from './components/Table';

const SuppliersPage = async () => {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <Table />
    </SessionProvider>
  );
};

export default SuppliersPage;
