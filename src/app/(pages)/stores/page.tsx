import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import { getAllStores } from './actions';
import Table from './components/Table';

const StoresPage = async () => {
  const session = await auth();
  const stores = await getAllStores();
  return (
    <SessionProvider session={session}>
      <Table data={stores} />
    </SessionProvider>
  );
};

export default StoresPage;
