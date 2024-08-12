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


interface ProductsState {
  pagination?: {
    count : number,
    pageCount: number,
  },
  items?: ProductDataTypes[],
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

  const createNewProducts = async (
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
            ...filters
          }),
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

  const deleteProduct = async (
    productData: ProductDataTypes,
  ): Promise<void> => {
    try {
      // setIsLoading(true);

      let url: string =
        process.env.NEXT_PUBLIC_BASE_URL +
        '/api/category?action=delete-category';
      let options: {} = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryId: productData._id }),
      };

      let response = await fetchData(url, options);

      if (response.ok) {
        toast.success('Category deleted successfully');
        getAllCategories();
      } else {
        toast.error(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while deleting the category');
    } finally {
      setIsLoading(false);
    }
  };

  const editCategory = async (
    categoryId: string | undefined,
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
        process.env.NEXT_PUBLIC_BASE_URL + '/api/category?action=edit-category';
      let options: {} = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryId, editedData }),
      };

      let response = await fetchData(url, options);

      if (response.ok) {
        toast.success('Category data edited successfully');
        handleResetState(setEditedData);
        getAllCategories();
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
    getAllCategories();
  }, []);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2 items-center">
        <h2 className="text-3xl font-semibold">Product Category List</h2>
        <CreateButton isLoading={isLoading} submitHandler={createNewCategory} />
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
              {categories.length !== 0 ? (
                categories.map((item: ProductDataTypes, index: number) => (
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
                              productData={item}
                              submitHandler={editCategory}
                            />
                            <DeleteButton
                              productData={item}
                              submitHandler={deleteCategory}
                            />
                          </div>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr key={0}>
                  <td
                    colSpan={session?.user?.role === 'administrator' ? 4 : 3}
                    className="align-center text-center"
                  >
                    No Category To Show.
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
