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
  getAllSuppliers as getAllSuppliersAction,
  getAllSuppliersFiltered as getAllSuppliersFilteredAction,
} from '../actions';
import { SupplierDataTypes } from '../schema';
import CreateButton from './Create';
import DeleteButton from './Delete';
import EditButton from './Edit';
import FilterButton from './Filter';

export interface SuppliersState {
  pagination?: {
    count: number;
    pageCount: number;
  };
  items?: SupplierDataTypes[];
}

interface TableDataProps {
  data: FormState;
}

const Table: React.FC<TableDataProps> = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<SuppliersState>({
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

  const getAllSuppliers = async (): Promise<void> => {
    try {
      // setIsLoading(true);

      let response = await getAllSuppliersAction({
        page: page,
        itemsPerPage: itemsPerPage,
      });
      if (response.error) {
        if (response?.message !== '') {
          toast.error(response.message);
        }
      } else if (response?.message !== '') {
        setSuppliers(JSON.parse(response.message));
      } else {
        console.log('Nothing was returned from the server');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while retrieving suppliers data');
    } finally {
      setIsLoading(false);
    }
  };

  const getAllSuppliersFiltered = async (): Promise<void> => {
    try {
      // setIsLoading(true);

      let response = await getAllSuppliersFilteredAction({
        page: isFiltered ? page : 1,
        itemsPerPage: itemsPerPage,
        filters: filters,
      });
      if (response.error) {
        if (response?.message !== '') {
          toast.error(response.message);
        }
      } else if (response?.message !== '') {
        setSuppliers(JSON.parse(response.message));
        setIsFiltered(true);
      } else {
        console.log('Nothing was returned from the server');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while retrieving suppliers data');
    } finally {
      setIsLoading(false);
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
      setSuppliers(JSON.parse(props.data.message));
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
      if (suppliers?.pagination?.pageCount == 1) return;
      if (!isFiltered) getAllSuppliers();
      else getAllSuppliersFiltered();
    }
    prevPage.current = page;
  }, [page]);

  useEffect(() => {
    if (suppliers?.pagination?.pageCount !== undefined) {
      setPage(1);
      if (prevPageCount.current !== 0) {
        if (!isFiltered) getAllSuppliersFiltered();
      }
      if (suppliers) setPageCount(suppliers?.pagination?.pageCount);
      prevPageCount.current = suppliers?.pagination?.pageCount;
      prevPage.current = 1;
    }
  }, [suppliers?.pagination?.pageCount]);

  useEffect(() => {
    // Reset to first page when itemsPerPage changes
    prevPageCount.current = 0;
    prevPage.current = 1;
    setPage(1);

    if (!isFiltered) getAllSuppliers();
    else getAllSuppliersFiltered();
  }, [itemsPerPage]);

  return (
    <>
      <h2 className="text-3xl font-semibold">Suppliers List</h2>
      <div className="flex flex-col sm:flex-row justify-between mb-4 mt-6 gap-2 items-center">
        <div className="items-center flex gap-2">
          <div className="inline-flex rounded-sm" role="group">
            <button
              onClick={handlePrevious}
              disabled={page === 1 || pageCount === 0 || isLoading}
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
                Page <b>{suppliers?.items?.length !== 0 ? page : 0}</b> of{' '}
                <b>{pageCount}</b>
              </label>
            </button>
            <button
              onClick={handleNext}
              disabled={page === pageCount || pageCount === 0 || isLoading}
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
            setSuppliers={setSuppliers}
          />
        </div>
        <CreateButton />
      </div>

      {isLoading && <p className="text-center">Loading...</p>}

      {!isLoading && (
        <div className="table-responsive text-nowrap text-sm">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th className="font-bold">S/N</th>
                <th className="font-bold">Name</th>
                <th className="font-bold">Company</th>
                <th className="font-bold">Reg. Date</th>
                <th className="font-bold">Email</th>
                <th className="font-bold">Phone</th>
                <th className="font-bold">Address</th>
                {session?.user?.role === 'administrator' && (
                  <th className="font-bold">Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {suppliers?.items?.length !== 0 ? (
                suppliers?.items?.map(
                  (item: SupplierDataTypes, index: number) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td className="capitalize">{item.name}</td>
                      <td className="test-wrap capitalize">{item.company}</td>

                      <td>
                        {item.reg_date
                          ? convertToDDMMYYYY(item.reg_date)
                          : 'N/A'}
                      </td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>

                      <ExtendableTd data={item.address || ''} />

                      {session?.user?.role === 'administrator' && (
                        <td
                          className="text-center"
                          style={{ verticalAlign: 'middle' }}
                        >
                          <div className="inline-block">
                            <div className="flex gap-2">
                              <EditButton supplierData={item} />
                              <DeleteButton supplierData={item} />
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
                    colSpan={session?.user?.role === 'administrator' ? 8 : 7}
                    className="align-center text-center"
                  >
                    No Supplier To Show.
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
