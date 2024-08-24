'use client';

import cn from '@/utility/cn';
import { ISO_to_DD_MM_YY as convertToDDMMYYYY } from '@/utility/dateConversion';
import fetchData from '@/utility/fetchData';
import moment from 'moment-timezone';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ProductDataTypes, handleResetState } from '../helpers';
import CreateButton from './Create';
import DeleteButton from './Delete';
import EditButton from './Edit';
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

  const [stores, setStores] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [suppliers, setSuppliers] = useState<string[]>([]);

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

  const inputValidations = (productData: ProductDataTypes): boolean => {
    if (
      !productData.batch ||
      !productData.name ||
      !productData.category?.length ||
      !productData.store?.length ||
      !productData.supplier?.length ||
      productData.quantity == undefined ||
      productData.cost_price == undefined
    ) {
      console.log(
        !productData.batch,
        !productData.name,
        productData.category?.length,
        productData.store?.length,
        productData.supplier?.length,
        productData.quantity == undefined,
        productData.cost_price == undefined,
      );
      toast.error('Please fill in all required fields');

      return false;
    }

    if (productData.exp_date) {
      if (moment(productData.exp_date).isBefore(moment())) {
        toast.error('Expiry date cannot be in the past');

        return false;
      }
      if (moment(productData.exp_date).isSame(moment())) {
        toast.error('Expiry date cannot be today');

        return false;
      }
      if (
        productData.mft_date &&
        moment(productData.exp_date) <= moment(productData.mft_date)
      ) {
        toast.error('Expiry date cannot be before manufacturing date');

        return false;
      }
    }

    if (productData.selling_price !== undefined) {
      if (productData.selling_price < productData.cost_price) {
        console.log(
          productData.selling_price,
          productData.cost_price,
          productData.selling_price < productData.cost_price,
          productData.selling_price > productData.cost_price,
          typeof productData.selling_price == 'number',
        );
        toast.error('Selling price must be equal or greater than cost price');

        return false;
      }
      if (productData.selling_price < 0) {
        toast.error('Selling price cannot be negative');

        return false;
      }
    } else {
      productData.selling_price = productData.cost_price;
    }

    return true;
  };

  const createNewProduct = async (
    productData: ProductDataTypes,
    setProductData: React.Dispatch<React.SetStateAction<ProductDataTypes>>,
  ): Promise<void> => {
    try {
      console.log(productData);

      if (!inputValidations(productData)) {
        // handleResetState(setProductData);
        return;
      }

      // setIsLoading(true);

      let url: string =
        process.env.NEXT_PUBLIC_BASE_URL +
        '/api/product?action=create-new-product';
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
      if (!inputValidations(editedData)) {
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

  const getStores = async (): Promise<void> => {
    try {
      setIsLoading(true);

      let url: string =
        process.env.NEXT_PUBLIC_BASE_URL + '/api/store?action=get-all-stores';
      let options: {} = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      let response = await fetchData(url, options);

      if (response.ok) {
        let stores: string[] = [];

        stores = response.data.map((store: { name: string }) => store.name);

        setStores(stores);
      } else {
        toast.error(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while retrieving stores data');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategories = async (): Promise<void> => {
    try {
      setIsLoading(true);

      let url: string =
        process.env.NEXT_PUBLIC_BASE_URL +
        '/api/category?action=get-all-categories';
      let options: {} = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      let response = await fetchData(url, options);

      if (response.ok) {
        let categories: string[] = [];

        categories = response.data.map(
          (category: { name: string }) => category.name,
        );

        setCategories(categories);
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

  const getSuppliers = async (): Promise<void> => {
    try {
      setIsLoading(true);

      let url: string =
        process.env.NEXT_PUBLIC_BASE_URL +
        '/api/supplier?action=get-all-suppliers-name';
      let options: {} = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      let response = await fetchData(url, options);

      if (response.ok) {
        let suppliers: string[] = [];
        suppliers = response.data.map(
          (supplier: { name: string }) => supplier.name,
        );
        setSuppliers(suppliers);
      } else {
        toast.error(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while retrieving suppliers data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
    getStores();
    getCategories();
    getSuppliers();
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
        <CreateButton
          suppliersList={suppliers}
          categoriesList={categories}
          isLoading={isLoading}
          storesList={stores}
          submitHandler={createNewProduct}
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
                <th className="font-bold">In Stock</th>
                <th className="font-bold">Store</th>
                <th className="font-bold">Supplier</th>
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
                      <td>{item.selling_price}</td>
                      <td>{item.quantity}</td>
                      <td
                        className="uppercase items-center"
                        style={{ verticalAlign: 'middle' }}
                      >
                        {item.store?.map((store, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400"
                          >
                            {store}
                          </span>
                        ))}
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

                      {session?.user?.role === 'administrator' && (
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
                                isLoading={isLoading}
                                productData={item}
                                submitHandler={editProduct}
                              />
                              <DeleteButton
                                productData={item}
                                submitHandler={deleteProduct}
                              />
                              {/* <button>Print Product Barcode</button> */}
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
