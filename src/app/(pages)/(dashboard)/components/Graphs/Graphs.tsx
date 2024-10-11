'use client';

import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FormState } from '../../actions';
import SalesByMonthGraph from './SalesByMonth';
import {
  default as SalesByStore,
  default as SalesByStoreGraph,
} from './SalesByStore';
import SalesVsExpenseGraph from './SalesVsExpense';

export interface GraphsData {
  salesByMonth: { [key: string]: number };
  salesByStore: { [key: string]: number };
  salesVsExpenses: { [key: string]: { sales: number; expenses: number } };
}

interface GraphProps {
  salesByMonth: FormState;
  salesByStore: FormState;
  salesVsExpenses: FormState;
}

const Graphs: React.FC<GraphProps> = props => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState({
    salesByMonth: false,
    salesByStore: false,
    salesVsExpenses: false,
  });

  const [salesByMonth, setSalesByMonth] = useState<GraphsData['salesByMonth']>(
    {},
  );
  const [salesByStore, setSalesByStore] = useState<GraphsData['salesByStore']>(
    {},
  );
  const [salesVsExpenses, setSalesVsExpenses] = useState<
    GraphsData['salesVsExpenses']
  >({});

  useEffect(() => {
    if (props.salesByMonth.error) {
      if (props.salesByMonth?.message !== '') {
        toast.error(props.salesByMonth.message);
      }
    } else if (props.salesByMonth?.message !== '') {
      setSalesByMonth(JSON.parse(props.salesByMonth.message));
    } else {
      console.log('Nothing was returned from the server');
    }
  }, [props.salesByMonth]);

  useEffect(() => {
    if (props.salesByStore.error) {
      if (props.salesByStore?.message !== '') {
        toast.error(props.salesByStore.message);
      }
    } else if (props.salesByStore?.message !== '') {
      setSalesByStore(JSON.parse(props.salesByStore.message));
    } else {
      console.log('Nothing was returned from the server');
    }
  }, [props.salesByStore]);

  useEffect(() => {
    if (props.salesVsExpenses.error) {
      if (props.salesVsExpenses?.message !== '') {
        toast.error(props.salesVsExpenses.message);
      }
    } else if (props.salesVsExpenses?.message !== '') {
      setSalesVsExpenses(JSON.parse(props.salesVsExpenses.message));
    } else {
      console.log('Nothing was returned from the server');
    }
  }, [props.salesVsExpenses]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex lg:flex-row flex-col gap-4">
        <div className="border rounded p-4 w-full">
          <p className="mt-4 text-xl font-semibold">Sales by Month</p>

          <p className="text-sm text-gray-800">
            Distribution of sales across months
          </p>

          <SalesByMonthGraph
            loading={loading.salesByMonth}
            data={salesByMonth}
            className="h-96"
          />
        </div>
        <div className="border rounded p-4 w-full">
          <p className="mt-4 text-xl font-semibold">
            Sales by Store Last 14 Days
          </p>

          <p className="text-sm text-gray-800">
            Store-wise sales over the last 14 days
          </p>

          <SalesByStoreGraph
            loading={loading.salesByStore}
            data={salesByStore}
            className="h-96"
          />
        </div>
      </div>
      <div className="border rounded p-4 w-full">
        <p className="mt-4 text-xl font-semibold">
          Sales vs Expenses Last 14 Days
        </p>
        <p className="text-sm text-gray-800">
          Comparison of daily sales and expenses
        </p>
        <SalesVsExpenseGraph
          loading={loading.salesVsExpenses}
          data={salesVsExpenses}
          className="h-96"
        />
      </div>
    </div>
  );
};

export default Graphs;
