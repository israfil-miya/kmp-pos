'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import CreateButton from './Create';
import fetchData from '@/utility/fetchData';
import { toast } from 'sonner';
import ExtendableTd from '@/components/ExtendableTd';
import DeleteButton from './Delete';
import { useSession } from 'next-auth/react';
import { ProductDataTypes, handleResetState } from '../helpers';
import EditButton from './Edit';
import moment from 'moment-timezone';
import { ISO_to_DD_MM_YY as convertToDDMMYYYY } from '@/utility/dateConversion';
import FilterButton from './Filter';

interface ProductsState {
  pagination?: {
    count: number;
    pageCount: number;
  };
  items?: ProductDataTypes[];
}

const Table = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductsState>({
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
  const [itemPerPage, setItemPerPage] = useState<number>(30);

  const prevPageCount = useRef<number>(0);
  const prevPage = useRef<number>(1);

  const [filters, setFilters] = useState({
    searchText: '',
  });

  const createNewProduct = async (
    productData: ProductDataTypes,
    setProductData: React.Dispatch<React.SetStateAction<ProductDataTypes>>,
  ): Promise<void> => {
    try {
      if (!productData.name) {
        toast.error('Please fill in all required fields');
        handleResetState(setProductData);
        return;
      }

      // setIsLoading(true);

      let url: string =
        process.env.NEXT_PUBLIC_BASE_URL +
        '/api/product?action=create-new-category';
      let options: {} = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      };

      let response = await fetchData(url, options);

      if (response.ok) {
        toast.success('New product added successfully');
        handleResetState(setProductData);
        if (!isFiltered) await getAllProducts();
        else await getAllProductsFiltered();
      } else {
        toast.error(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while submitting the form');
    } finally {
      setIsLoading(false);
    }
  };

  const getAllProducts = async (): Promise<void> => {
    try {
      // setIsLoading(true);

      let url: string =
        process.env.NEXT_PUBLIC_BASE_URL +
        '/api/product?action=get-all-products';
      let options: {} = {
        method: 'POST',
        headers: {
          filtered: false,
          paginated: true,
          item_per_page: itemPerPage,
          page,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      };

      let response = await fetchData(url, options);

      if (response.ok) {
        setProducts(response.data);
      } else {
        toast.error(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while retrieving categories data');
    } finally {
      setIsLoading(false);
    }
  };

  const getAllProductsFiltered = async (): Promise<void> => {
    try {
      // setIsLoading(true);

      let url: string =
        process.env.NEXT_PUBLIC_BASE_URL +
        '/api/product?action=get-all-products';
      let options: {} = {
        method: 'POST',
        headers: {
          filtered: true,
          paginated: true,
          item_per_page: itemPerPage,
          page,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...filters,
        }),
      };

      let response = await fetchData(url, options);

      if (response.ok) {
        setProducts(response.data);
        setIsFiltered(true);
      } else {
        toast.error(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while retrieving categories data');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (
    productData: ProductDataTypes,
  ): Promise<void> => {
    try {
      // setIsLoading(true);

      let url: string =
        process.env.NEXT_PUBLIC_BASE_URL + '/api/product?action=delete-product';
      let options: {} = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: productData._id }),
      };

      let response = await fetchData(url, options);

      if (response.ok) {
        toast.success('Product deleted successfully');
        if (!isFiltered) await getAllProducts();
        else await getAllProductsFiltered();
      } else {
        toast.error(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while deleting the product');
    } finally {
      setIsLoading(false);
    }
  };

  const editProduct = async (
    productId: string | undefined,
    productData: ProductDataTypes,
    editedData: ProductDataTypes,
    setEditedData: React.Dispatch<React.SetStateAction<ProductDataTypes>>,
  ): Promise<void> => {
    try {
      if (!editedData.name) {
        toast.error('Please fill in all required fields');
        handleResetState(setEditedData);
        return;
      }

      // setIsLoading(true);

      let url: string =
        process.env.NEXT_PUBLIC_BASE_URL + '/api/product?action=edit-product';
      let options: {} = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, editedData }),
      };

      let response = await fetchData(url, options);

      if (response.ok) {
        toast.success('Product data edited successfully');
        handleResetState(setEditedData);
        if (!isFiltered) await getAllProducts();
        else await getAllProductsFiltered();
      } else {
        toast.error(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while submitting the form');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

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
    // Reset to first page when itemPerPage changes
    prevPageCount.current = 0;
    prevPage.current = 1;
    setPage(1);

    if (!isFiltered) getAllProducts();
    else getAllProductsFiltered();
  }, [itemPerPage]);

  return (
    <>
      <h2 className="text-3xl font-semibold">Products List</h2>
      <div className="flex flex-col sm:flex-row justify-between mb-4 mt-6 gap-2 items-center">
        <div className="items-center flex gap-2">
          <div className="inline-flex rounded-md" role="group">
            <button
              onClick={handlePrevious}
              disabled={page === 1 || pageCount === 0 || isLoading}
              type="button"
              className="inline-flex items-center px-4 py-2 text-sm bg-gray-200 text-gray-700 border border-gray-200 rounded-s-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
              className="inline-flex items-center px-4 py-2 text-sm bg-gray-200 text-gray-700 border border-gray-200 rounded-e-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
            value={itemPerPage}
            onChange={e => setItemPerPage(parseInt(e.target.value))}
            // defaultValue={30}
            required
            className="appearance-none bg-gray-200 text-gray-700 border border-gray-200 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          >
            <option value={30}>30</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <FilterButton
            isLoading={isLoading}
            submitHandler={getAllProductsFiltered}
            setFilters={setFilters}
            filters={filters}
          />
        </div>
        <CreateButton isLoading={isLoading} submitHandler={createNewProduct} />
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
                <th className="font-bold">In Stock</th>
                <th className="font-bold">Store</th>
                <th className="font-bold">Status</th>
                {session?.user?.role === 'administrator' && (
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
                      <td>{item.category}</td>
                      <td>
                        {item.exp_date
                          ? convertToDDMMYYYY(item.exp_date)
                          : 'N/A'}
                      </td>

                      {session?.user?.role === 'administrator' && (
                        <td
                          className="text-center"
                          style={{ verticalAlign: 'middle' }}
                        >
                          <div className="inline-block">
                            <div className="flex gap-2">
                              <EditButton
                                isLoading={isLoading}
                                categoryData={item}
                                // productData={item}
                                submitHandler={editProduct}
                              />
                              <DeleteButton
                                productData={item}
                                submitHandler={deleteProduct}
                              />
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
                    colSpan={session?.user?.role === 'administrator' ? 10 : 9}
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
            padding: 2.5px 10px;
          }
        `}
      </style>
    </>
  );
};

export default Table;
