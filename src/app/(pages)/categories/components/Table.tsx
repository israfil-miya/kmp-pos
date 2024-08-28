'use client';

import ExtendableTd from '@/components/ExtendableTd';
import { ISO_to_DD_MM_YY as convertToDDMMYYYY } from '@/utility/dateConversion';
import fetchData from '@/utility/fetchData';
import moment from 'moment-timezone';
import { useSession } from 'next-auth/react';
import { revalidatePath } from 'next/cache';
import { useRouter } from 'next/navigation';
import React, { RefObject, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CategoryDataTypes } from '../type';
import CreateButton from './Create';
import DeleteButton from './Delete';
import EditButton from './Edit';

const Table = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryDataTypes[]>([]);
  const { data: session } = useSession();

  const createNewCategory = async (
    data: CategoryDataTypes,
    formRef: RefObject<HTMLFormElement>,
  ): Promise<void> => {
    try {
      // setIsLoading(true);

      let url: string =
        process.env.NEXT_PUBLIC_BASE_URL +
        '/api/category?action=create-new-category';
      let options: {} = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };

      let response = await fetchData(url, options);

      if (response.ok) {
        toast.success('New category added successfully');
        formRef.current?.reset();
        revalidatePath('/categories');
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

  const getAllCategories = async (): Promise<void> => {
    try {
      // setIsLoading(true);

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
        setCategories(response.data);
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

  // const deleteCategory = async (
  //   categoryData: CategoryDataTypes,
  // ): Promise<void> => {
  //   try {
  //     // setIsLoading(true);

  //     let url: string =
  //       process.env.NEXT_PUBLIC_BASE_URL +
  //       '/api/category?action=delete-category';
  //     let options: {} = {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ categoryId: categoryData._id }),
  //     };

  //     let response = await fetchData(url, options);

  //     if (response.ok) {
  //       toast.success('Category deleted successfully');
  //       getAllCategories();
  //     } else {
  //       toast.error(response.data);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error('An error occurred while deleting the category');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const editCategory = async (
  //   categoryId: string | undefined,
  //   categoryData: CategoryDataTypes,
  //   editedData: CategoryDataTypes,
  //   setEditedData: React.Dispatch<React.SetStateAction<CategoryDataTypes>>,
  // ): Promise<void> => {
  //   try {
  //     // if (!editedData.name) {
  //     //   toast.error('Please fill in all required fields');
  //     //   handleResetState(setEditedData);
  //     //   return;
  //     // }

  //     // // setIsLoading(true);

  //     // let url: string =
  //     //   process.env.NEXT_PUBLIC_BASE_URL + '/api/category?action=edit-category';
  //     // let options: {} = {
  //     //   method: 'POST',
  //     //   headers: {
  //     //     'Content-Type': 'application/json',
  //     //   },
  //     //   body: JSON.stringify({ categoryId, editedData }),
  //     // };

  //     // let response = await fetchData(url, options);

  //     // if (response.ok) {
  //     //   toast.success('Category data edited successfully');
  //     //   handleResetState(setEditedData);
  //     //   getAllCategories();
  //     // } else {
  //     //   toast.error(response.data);
  //     // }
  //     return void 0;
  //   } catch (error) {
  //     console.error(error);
  //     toast.error('An error occurred while submitting the form');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

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
                <th className="font-bold">Category Name</th>
                <th className="font-bold">Creation Date</th>
                {/* {session?.user?.role === 'administrator' && (
                  <th className="font-bold">Action</th>
                )} */}
              </tr>
            </thead>
            <tbody>
              {categories.length !== 0 ? (
                categories.map((item: CategoryDataTypes, index: number) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td className="capitalize">{item.name}</td>
                    <td>
                      {item.createdAt
                        ? moment(
                            convertToDDMMYYYY(item?.createdAt),
                            'DD-MM-YYYY',
                          ).format('Do MMMM, YYYY')
                        : null}
                    </td>
                    {session?.user?.role === 'administrator' && (
                      <td
                        className="text-center"
                        style={{ verticalAlign: 'middle' }}
                      >
                        <div className="inline-block">
                          <div className="flex gap-2">
                            {/* <EditButton
                              isLoading={isLoading}
                              categoryData={item}
                              submitHandler={editCategory}
                            /> */}
                            {/* <DeleteButton
                              categoryData={item}
                              submitHandler={deleteCategory}
                            /> */}
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
