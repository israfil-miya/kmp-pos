import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import { getAllStoreNames, getAllUsers } from './actions';
import Table from './components/Table';

const UsersPage = async () => {
  const session = await auth();
  const users = await getAllUsers();
  const storeNames = await getAllStoreNames();

  return (
    <SessionProvider session={session}>
      <Table data={users} storeNames={storeNames} />
    </SessionProvider>
  );
};

export default UsersPage;
