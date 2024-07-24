import React from 'react';
import Table from './components/Table';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';

const StoresPage = async () => {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <Table />
    </SessionProvider>
  );
};

export default StoresPage;
