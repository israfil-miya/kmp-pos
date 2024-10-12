'use client';

import cn from '@/utility/cn';
import { ISO_to_DD_MM_YY as convertToDDMMYYYY } from '@/utility/dateConversion';
import fetchData from '@/utility/fetchData';
import moment from 'moment-timezone';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  FormState,
  getAllProducts as getAllProductsAction,
  getAllProductsFiltered as getAllProductsFilteredAction,
} from '../actions';
import { ProductDataTypes, ProductSortEnum } from '../schema';
import BarcodeButton from './Barcode';
import CreateButton from './Create';
import DeleteButton from './Delete';
import EditButton from './Edit';
import FilterButton from './Filter';
import SortButton from './Sort';

export interface ProductsState {
  pagination?: {
    count: number;
    pageCount: number;
  };
  items?: ProductDataTypes[];
}

interface TableDataProps {
  storeNames: FormState;
  categoryNames: FormState;
  supplierNames: FormState;
  data: FormState;
}

type OptionsDataTypes = {
  Filtered: {
    page: number;
    itemsPerPage: number;
    filters: {
      searchText: string;
    };
    sortBy: ProductSortEnum;
    store?: string;
  };
  NonFiltered: {
    page: number;
    itemsPerPage: number;
    sortBy: ProductSortEnum;
    store?: string;
  };
};

const Table: React.FC<TableDataProps> = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductsState>({
    pagination: {
      count: 0,
      pageCount: 0,
    },
    items: [],
  });
  const { data: session } = useSession();

  const [stores, setStores] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [suppliers, setSuppliers] = useState<string[]>([]);

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

  const authorizedToPerformAction = ['administrator', 'manager'].includes(
    session?.user.role || '',
  );

  const [sortBy, setSortBy] = useState<ProductSortEnum>(
    ProductSortEnum.AddedDesc,
  );

  const getAllProducts = async (): Promise<void> => {
    try {
      // setIsLoading(true);

      let options: OptionsDataTypes['NonFiltered'] = {
        page: page,
        itemsPerPage: itemsPerPage,
        sortBy: sortBy,
      };

      if (session?.user?.store) {
        options['store'] = session?.user?.store;
      }

      let response = await getAllProductsAction(options);
      if (response.error) {
        if (response?.message !== '') {
          toast.error(response.message);
        }
      } else if (response?.message !== '') {
        setProducts(JSON.parse(response.message));
      } else {
        console.log('Nothing was returned from the server');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while retrieving products data');
    } finally {
      setIsLoading(false);
    }
  };

  const getAllProductsFiltered = async (): Promise<void> => {
    try {
      // setIsLoading(true);

      let options: OptionsDataTypes['Filtered'] = {
        page: page,
        itemsPerPage: itemsPerPage,
        filters: filters,
        sortBy: sortBy,
      };

      if (session?.user?.store) {
        options['store'] = session?.user?.store;
      }

      let response = await getAllProductsFilteredAction(options);
      if (response.error) {
        if (response?.message !== '') {
          toast.error(response.message);
        }
      } else if (response?.message !== '') {
        setProducts(JSON.parse(response.message));
        setIsFiltered(true);
      } else {
        console.log('Nothing was returned from the server');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while retrieving products data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (props.storeNames.error) {
      if (props.storeNames?.message !== '') {
        toast.error(props.storeNames.message);
      }
    } else if (props.storeNames?.message !== '') {
      setStores(JSON.parse(props.storeNames.message));
    } else {
      console.log('Nothing was returned from the server');
    }
  }, [props.storeNames]);

  useEffect(() => {
    if (props.categoryNames.error) {
      if (props.categoryNames?.message !== '') {
        toast.error(props.categoryNames.message);
      }
    } else if (props.categoryNames?.message !== '') {
      setCategories(JSON.parse(props.categoryNames.message));
    } else {
      console.log('Nothing was returned from the server');
    }
  }, [props.categoryNames]);

  useEffect(() => {
    if (props.supplierNames.error) {
      if (props.supplierNames?.message !== '') {
        toast.error(props.supplierNames.message);
      }
    } else if (props.supplierNames?.message !== '') {
      setSuppliers(JSON.parse(props.supplierNames.message));
    } else {
      console.log('Nothing was returned from the server');
    }
  }, [props.supplierNames]);

  useEffect(() => {
    if (props.data.error) {
      if (props.data?.message !== '') {
        toast.error(props.data.message);
      }
    } else if (props.data?.message !== '') {
      setProducts(JSON.parse(props.data.message));
    } else {
      console.log('Nothing was returned from the server');
    }
  }, [props.data]);

  function handlePrevious() {
    setPage(p => {
      if (p === 1) return p;
      return p - 1;
    });
  }

  function handleNext() {
    setPage(p => {
      if (p === pageCount) return p;
      return p + 1;
    });
  }

  useEffect(() => {
    if (prevPage.current !== 1 || page > 1) {
      if (products?.pagination?.pageCount == 1) return;
      if (!isFiltered) getAllProducts();
      else getAllProductsFiltered();
    }
    prevPage.current = page;
  }, [page]);

  useEffect(() => {
    if (products?.pagination?.pageCount !== undefined) {
      setPage(1);
      if (prevPageCount.current !== 0) {
        if (!isFiltered) getAllProductsFiltered();
      }
      if (products) setPageCount(products?.pagination?.pageCount);
      prevPageCount.current = products?.pagination?.pageCount;
      prevPage.current = 1;
    }
  }, [products?.pagination?.pageCount]);

  useEffect(() => {
    // Reset to first page when itemsPerPage changes
    prevPageCount.current = 0;
    prevPage.current = 1;
    setPage(1);

    if (!isFiltered) getAllProducts();
    else getAllProductsFiltered();
  }, [itemsPerPage]);

  return (
    <>
      <h2 className="text-3xl font-semibold">Products List</h2>
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
                Page <b>{products?.items?.length !== 0 ? page : 0}</b> of{' '}
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
            setProducts={setProducts}
          />
          <SortButton
            page={page}
            itemsPerPage={itemsPerPage}
            setSortBy={setSortBy}
            sortBy={sortBy}
            filters={filters}
            setIsFiltered={setIsFiltered}
            setProducts={setProducts}
          />
        </div>
        <CreateButton
          suppliersList={suppliers}
          categoriesList={categories}
          storesList={stores}
        />
      </div>

      {isLoading && <p className="text-center">Loading...</p>}

      {!isLoading && (
        <div className="table-responsive text-nowrap text-sm">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th className="font-bold">S/N</th>
                <th className="font-bold">Barcode</th>
                <th className="font-bold">Products</th>
                <th className="font-bold">Category</th>
                <th className="font-bold">Expire</th>
                <th className="font-bold">Price</th>
                <th className="font-bold">Stock</th>
                <th className="font-bold">Store</th>
                <th className="font-bold">Supplier</th>
                <th className="font-bold">Restocked</th>
                <th className="font-bold">Status</th>
                {authorizedToPerformAction && (
                  <th className="font-bold">Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {products?.items?.length !== 0 ? (
                products?.items?.map(
                  (item: ProductDataTypes, index: number) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.batch}</td>
                      <td className="capitalize">{item.name}</td>
                      <td
                        className="uppercase items-center"
                        style={{ verticalAlign: 'middle' }}
                      >
                        {item.category?.map((category, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400"
                          >
                            {category}
                          </span>
                        ))}
                      </td>

                      <td>
                        {item.exp_date
                          ? convertToDDMMYYYY(item.exp_date)
                          : 'N/A'}
                      </td>
                      <td>{item.selling_price} ৳</td>
                      <td>{item.quantity}</td>
                      <td
                        className="uppercase items-center"
                        style={{ verticalAlign: 'middle' }}
                      >
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400"
                        >
                          {item.store}
                        </span>
                      </td>
                      <td
                        className="uppercase items-center text-wrap"
                        style={{ verticalAlign: 'middle' }}
                      >
                        {item.supplier?.map((supplier, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400"
                          >
                            {supplier}
                          </span>
                        ))}
                      </td>

                      <td>
                        {item.restock_date
                          ? convertToDDMMYYYY(item.restock_date)
                          : 'N/A'}
                      </td>
                      <td
                        className="uppercase items-center"
                        style={{ verticalAlign: 'middle' }}
                      >
                        <span
                          key={index}
                          className={cn(
                            'text-xs font-medium px-2.5 py-0.5 rounded border',
                            item.in_stock
                              ? 'bg-green-100 text-green-800 border-green-400'
                              : 'bg-red-100 text-red-800 border-red-400',
                          )}
                        >
                          {item.in_stock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>

                      {authorizedToPerformAction && (
                        <td
                          className="text-center"
                          style={{ verticalAlign: 'middle' }}
                        >
                          <div className="inline-block">
                            <div className="flex gap-2">
                              <EditButton
                                storesList={stores}
                                categoriesList={categories}
                                suppliersList={suppliers}
                                productData={item}
                              />
                              <DeleteButton productData={item} />
                              <BarcodeButton productData={item} />
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
                    colSpan={authorizedToPerformAction ? 12 : 11}
                    className="align-center text-center"
                  >
                    No Product To Show.
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
