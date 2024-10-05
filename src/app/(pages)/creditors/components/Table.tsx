'use client';

import cn from '@/utility/cn';
import { YYYY_MM_DD_to_DD_MM_YY as convertToDDMMYYYY } from '@/utility/dateConversion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { InvoiceDataTypes } from '../../invoices/schema';
import {
  FormState,
  getAllCreditors as getAllCreditorsAction,
  getAllCreditorsFiltered as getAllCreditorsFilteredAction,
} from '../actions';
import EditButton from './Edit';
import FilterButton from './Filter';

export interface CreditorsState {
  pagination?: {
    count: number;
    pageCount: number;
  };
  items?: InvoiceDataTypes[];
}

interface TableDataProps {
  data: FormState;
}

const Table: React.FC<TableDataProps> = props => {
  const [loading, setLoading] = useState(false);
  const [creditors, setCreditors] = useState<CreditorsState>({
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

  const [filters, setFilters] = useState({
    searchText: '',
  });

  const getAllCreditors = async (): Promise<void> => {
    try {
      // setLoading(true);

      let response = await getAllCreditorsAction({
        page: page,
        itemsPerPage: itemsPerPage,
      });
      if (response.error) {
        if (response?.message !== '') {
          toast.error(response.message);
        }
      } else if (response?.message !== '') {
        setCreditors(JSON.parse(response.message));
      } else {
        console.log('Nothing was returned from the server');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while retrieving creditors data');
    } finally {
      setLoading(false);
    }
  };

  const getAllCreditorsFiltered = async (): Promise<void> => {
    try {
      // setLoading(true);

      let response = await getAllCreditorsFilteredAction({
        page: isFiltered ? page : 1,
        itemsPerPage: itemsPerPage,
        filters: filters,
      });
      if (response.error) {
        if (response?.message !== '') {
          toast.error(response.message);
        }
      } else if (response?.message !== '') {
        setCreditors(JSON.parse(response.message));
        setIsFiltered(true);
      } else {
        console.log('Nothing was returned from the server');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while retrieving creditors data');
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
      setCreditors(JSON.parse(props.data.message));
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
      if (creditors?.pagination?.pageCount == 1) return;
      if (!isFiltered) getAllCreditors();
      else getAllCreditorsFiltered();
    }
    prevPage.current = page;
  }, [page]);

  useEffect(() => {
    if (creditors?.pagination?.pageCount !== undefined) {
      setPage(1);
      if (prevPageCount.current !== 0) {
        if (!isFiltered) getAllCreditorsFiltered();
      }
      if (creditors) setPageCount(creditors?.pagination?.pageCount);
      prevPageCount.current = creditors?.pagination?.pageCount;
      prevPage.current = 1;
    }
  }, [creditors?.pagination?.pageCount]);

  useEffect(() => {
    // Reset to first page when itemsPerPage changes
    prevPageCount.current = 0;
    prevPage.current = 1;
    setPage(1);

    if (!isFiltered) getAllCreditors();
    else getAllCreditorsFiltered();
  }, [itemsPerPage]);

  return (
    <>
      <h2 className="text-3xl font-semibold">Creditors List</h2>
      <div className="flex flex-col sm:flex-row justify-between mb-4 mt-6 gap-2 items-center">
        <div className="items-center justify-start flex gap-2">
          <div className="inline-flex rounded-sm" role="group">
            <button
              onClick={handlePrevious}
              disabled={page === 1 || pageCount === 0 || loading}
              type="button"
              className="inline-flex items-center px-4 py-2 text-sm bg-gray-200 text-gray-700 border border-gray-200 rounded-s-sm leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
                Page <b>{creditors?.items?.length !== 0 ? page : 0}</b> of{' '}
                <b>{pageCount}</b>
              </label>
            </button>
            <button
              onClick={handleNext}
              disabled={page === pageCount || pageCount === 0 || loading}
              type="button"
              className="inline-flex items-center px-4 py-2 text-sm bg-gray-200 text-gray-700 border border-gray-200 rounded-s-sm leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
            className="appearance-none bg-gray-200 text-gray-700 border border-gray-200 rounded-sm leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
            setCreditors={setCreditors}
          />
        </div>
        {/* <CreateButton /> */}
      </div>

      {loading && <p className="text-center">Loading...</p>}

      {!loading && (
        <div className="table-responsive text-nowrap text-sm">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th className="font-bold">S/N</th>
                <th className="font-bold">ID</th>
                <th className="font-bold">Customer</th>
                <th className="font-bold">Phone</th>
                <th className="font-bold">Address</th>
                <th className="font-bold">Cashier</th>
                <th className="font-bold">NOP</th>
                <th className="font-bold">Bill</th>
                <th className="font-bold">Paid</th>
                <th className="font-bold">Method</th>
                {session?.user?.role === 'administrator' && (
                  <th className="font-bold">Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {creditors?.items?.length !== 0 ? (
                creditors?.items?.map(
                  (item: InvoiceDataTypes, index: number) => (
                    <tr key={String(item._id)}>
                      <td>{index + 1}</td>
                      <td>{item.invoice_no}</td>
                      <td className="capitalize">
                        {item.customer?.name || 'N/A'}
                      </td>
                      <td className="capitalize">
                        {item.customer?.phone || 'N/A'}
                      </td>
                      <td className="capitalize">
                        {item.customer?.address || 'N/A'}
                      </td>
                      <td className="capitalize">{item.cashier}</td>
                      <td>
                        {item.products
                          .map(product => product.unit)
                          .reduce((a, b) => a + b, 0)}
                      </td>

                      <td>{item.grand_total.toLocaleString() || '0'} ৳</td>
                      <td>{item.paid_amount.toLocaleString() || '0'} ৳</td>
                      <td className="capitalize">{item.payment_method}</td>

                      {session?.user?.role === 'administrator' && (
                        <td
                          className="text-center"
                          style={{ verticalAlign: 'middle' }}
                        >
                          <div className="inline-block">
                            <div className="flex gap-2">
                              <EditButton creditorData={item} />
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
                    colSpan={session?.user?.role === 'administrator' ? 11 : 10}
                    className="align-center text-center"
                  >
                    No Invoice To Show.
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
