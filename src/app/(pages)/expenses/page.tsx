import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import { getAllExpenses } from './actions';
import Table from './components/Table';

const ExpensesPage = async () => {
  const session = await auth();
  const expenses = await getAllExpenses({
    page: 1,
    itemsPerPage: 30,
    store: session?.user?.store,
  });
  return (
    <SessionProvider session={session}>
      <Table data={expenses} />
    </SessionProvider>
  );
};

export default ExpensesPage;
