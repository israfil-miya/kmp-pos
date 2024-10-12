'use client';

import ExtendableTd from '@/components/ExtendableTd';
import { ISO_to_DD_MM_YY as convertToDDMMYYYY } from '@/utility/dateConversion';
import fetchData from '@/utility/fetchData';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  FormState,
  getAllExpenses as getAllExpensesAction,
  getAllExpensesFiltered as getAllExpensesFilteredAction,
} from '../actions';
import { ExpenseDataTypes } from '../schema';
import CreateButton from './Create';
import DeleteButton from './Delete';
import EditButton from './Edit';
import FilterButton from './Filter';

export interface ExpensesState {
  pagination?: {
    count: number;
    pageCount: number;
  };
  items?: ExpenseDataTypes[];
}

interface TableDataProps {
  data: FormState;
}

type OptionsDataTypes = {
  Filtered: {
    page: number;
    itemsPerPage: number;
    filters: {
      searchText: string;
    };
    store?: string;
  };
  NonFiltered: {
    page: number;
    itemsPerPage: number;
    store?: string;
  };
};

const Table: React.FC<TableDataProps> = props => {
  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState<ExpensesState>({
    pagination: {
      count: 0,
      pageCount: 0,
    },
    items: [],
  });
  const { data: session } = useSession();

  const router = useRouter();

  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(30);

  const prevPageCount = useRef<number>(0);
  const prevPage = useRef<number>(1);

  const authorizedToPerformAction = ['administrator', 'manager'].includes(
    session?.user.role || '',
  );

  const [filters, setFilters] = useState({
    searchText: '',
  });

  const getAllExpenses = async (): Promise<void> => {
    try {
      // setLoading(true);

      let options: OptionsDataTypes['NonFiltered'] = {
        page: page,
        itemsPerPage: itemsPerPage,
      };

      if (session?.user?.store) {
        options['store'] = session?.user?.store;
      }

      let response = await getAllExpensesAction(options);
      if (response.error) {
        if (response?.message !== '') {
          toast.error(response.message);
        }
      } else if (response?.message !== '') {
        setExpenses(JSON.parse(response.message));
      } else {
        console.log('Nothing was returned from the server');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while retrieving expenses data');
    } finally {
      setLoading(false);
    }
  };

  const getAllExpensesFiltered = async (): Promise<void> => {
    try {
      // setLoading(true);

      let options: OptionsDataTypes['Filtered'] = {
        page: page,
        itemsPerPage: itemsPerPage,
        filters: filters,
      };

      if (session?.user?.store) {
        options['store'] = session?.user?.store;
      }

      let response = await getAllExpensesFilteredAction(options);

      if (response.error) {
        if (response?.message !== '') {
          toast.error(response.message);
        }
      } else if (response?.message !== '') {
        setExpenses(JSON.parse(response.message));
        setIsFiltered(true);
      } else {
        console.log('Nothing was returned from the server');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while retrieving expenses data');
    } finally {
      setLoading(false);
    }
  };

  function handlePrevious() {
    setPage(p => {
      if (p === 1) return p;
      return p - 1;
    });
  }

  useEffect(() => {
    if (props.data.error) {
      if (props.data?.message !== '') {
        toast.error(props.data.message);
      }
    } else if (props.data?.message !== '') {
      setExpenses(JSON.parse(props.data.message));
    } else {
      console.log('Nothing was returned from the server');
    }
  }, [props.data]);

  function handleNext() {
    setPage(p => {
      if (p === pageCount) return p;
      return p + 1;
    });
  }

  useEffect(() => {
    if (prevPage.current !== 1 || page > 1) {
      if (expenses?.pagination?.pageCount == 1) return;
      if (!isFiltered) getAllExpenses();
      else getAllExpensesFiltered();
    }
    prevPage.current = page;
  }, [page]);

  useEffect(() => {
    if (expenses?.pagination?.pageCount !== undefined) {
      setPage(1);
      if (prevPageCount.current !== 0) {
        if (!isFiltered) getAllExpensesFiltered();
      }
      if (expenses) setPageCount(expenses?.pagination?.pageCount);
      prevPageCount.current = expenses?.pagination?.pageCount;
      prevPage.current = 1;
    }
  }, [expenses?.pagination?.pageCount]);

  useEffect(() => {
    // Reset to first page when itemsPerPage changes
    prevPageCount.current = 0;
    prevPage.current = 1;
    setPage(1);

    if (!isFiltered) getAllExpenses();
    else getAllExpensesFiltered();
  }, [itemsPerPage]);

  return (
    <>
      <h2 className="text-3xl font-semibold">Expenses List</h2>
      <div className="flex flex-col sm:flex-row justify-between mb-4 mt-6 gap-2 items-center">
        <div className="items-center flex gap-2">
          <div className="inline-flex rounded-sm" role="group">
            <button
              onClick={handlePrevious}
              disabled={page === 1 || pageCount === 0 || loading}
              type="button"
              className="inline-flex items-center px-4 py-2 text-sm bg-gray-50 text-gray-700 border border-gray-200 rounded-s-sm leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5"
                />
              </svg>
              Prev
            </button>
            <button
              disabled={true}
              className="hidden sm:visible sm:inline-flex items-center px-4 py-2 text-sm font-medium border"
            >
              <label>
                Page <b>{expenses?.items?.length !== 0 ? page : 0}</b> of{' '}
                <b>{pageCount}</b>
              </label>
            </button>
            <button
              onClick={handleNext}
              disabled={page === pageCount || pageCount === 0 || loading}
              type="button"
              className="inline-flex items-center px-4 py-2 text-sm bg-gray-50 text-gray-700 border border-gray-200 rounded-s-sm leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            >
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"
                />
              </svg>
            </button>
          </div>

          <select
            value={itemsPerPage}
            onChange={e => setItemsPerPage(parseInt(e.target.value))}
            required
            className="appearance-none bg-gray-50 text-gray-700 border border-gray-200 rounded-sm leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          >
            <option value={30}>30</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <FilterButton
            page={page}
            itemsPerPage={itemsPerPage}
            setFilters={setFilters}
            setIsFiltered={setIsFiltered}
            setExpenses={setExpenses}
          />
        </div>
        <CreateButton />
      </div>

      {loading && <p className="text-center">Loading...</p>}

      {!loading && (
        <div className="table-responsive text-nowrap text-sm">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th className="font-bold">S/N</th>
                <th className="font-bold">Name</th>
                <th className="font-bold">Store</th>
                <th className="font-bold">Reason</th>
                <th className="font-bold">Category</th>
                <th className="font-bold">Amount</th>
                <th className="font-bold">Creation Date</th>
                <th className="font-bold">Last Update</th>
                {authorizedToPerformAction && (
                  <th className="font-bold">Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {expenses?.items?.length !== 0 ? (
                expenses?.items?.map(
                  (item: ExpenseDataTypes, index: number) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td className="capitalize">{item.full_name}</td>
                      <td
                        className="uppercase items-center"
                        style={{ verticalAlign: 'middle' }}
                      >
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400"
                        >
                          {item.store_name}
                        </span>
                      </td>
                      <td className="test-wrap capitalize">{item.reason}</td>
                      <td
                        className="uppercase items-center"
                        style={{ verticalAlign: 'middle' }}
                      >
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400"
                        >
                          {item.category}
                        </span>
                      </td>
                      <td>{item.amount || 0} ৳</td>

                      <td>
                        {item.createdAt
                          ? convertToDDMMYYYY(item.createdAt)
                          : 'N/A'}
                      </td>
                      <td>
                        {item.updatedAt
                          ? convertToDDMMYYYY(item.updatedAt)
                          : 'N/A'}
                      </td>

                      {authorizedToPerformAction && (
                        <td
                          className="text-center"
                          style={{ verticalAlign: 'middle' }}
                        >
                          <div className="inline-block">
                            <div className="flex gap-2">
                              {session?.user.role === 'administrator' && (
                                <EditButton expenseData={item} />
                              )}
                              <DeleteButton expenseData={item} />
                            </div>
                          </div>
                        </td>
                      )}
                    </tr>
                  ),
                )
              ) : (
                <tr key={0}>
                  <td
                    colSpan={authorizedToPerformAction ? 9 : 8}
                    className="align-center text-center"
                  >
                    No Expense To Show.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>
        {`
          th,
          td {
            padding: 5px 10px;
          }
        `}
      </style>
    </>
  );
};

export default Table;
