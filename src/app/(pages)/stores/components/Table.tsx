'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CreateButton from './Create';
import fetchData from '@/utility/fetchdata';
import { toast } from 'sonner';
import ExtendableTd from '@/components/ExtendableTd';
import DeleteButton from './Delete';
import { useSession } from 'next-auth/react';
import { StoreDataTypes, handleResetState } from '../helpers';
import EditButton from './Edit';

const Table = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [stores, setStores] = useState<StoreDataTypes[]>([]);
  const { data: session } = useSession();

  const createNewStore = async (
    storeData: StoreDataTypes,
    setStoreData: React.Dispatch<React.SetStateAction<StoreDataTypes>>,
  ): Promise<void> => {
    try {
      console.log(storeData);
      if (!storeData.name || !storeData.status) {
        console.log('if statement ', storeData);
        toast.error('Please fill in all required fields');
        handleResetState(setStoreData);
        return;
      }

      // setIsLoading(true);

      let url: string =
        process.env.NEXT_PUBLIC_BASE_URL + '/api/store?action=create-new-store';
      let options: {} = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storeData),
      };

      let response = await fetchData(url, options);

      if (response.ok) {
        toast.success('New store added successfully');
        handleResetState(setStoreData);
        getAllStores();
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

  const getAllStores = async (): Promise<void> => {
    try {
      // setIsLoading(true);

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
        setStores(response.data);
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

  const deleteStore = async (storeData: StoreDataTypes): Promise<void> => {
    try {
      // setIsLoading(true);

      let url: string =
        process.env.NEXT_PUBLIC_BASE_URL + '/api/store?action=delete-store';
      let options: {} = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ storeId: storeData._id }),
      };

      let response = await fetchData(url, options);

      if (response.ok) {
        toast.success('Store deleted successfully');
        getAllStores();
      } else {
        toast.error(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while deleting the store');
    } finally {
      setIsLoading(false);
    }
  };

  const editStore = async (
    storeId: string | undefined,
    storeData: StoreDataTypes,
    editedData: StoreDataTypes,
    setEditedData: React.Dispatch<React.SetStateAction<StoreDataTypes>>,
  ): Promise<void> => {
    try {
      if (!editedData.name || !editedData.status) {
        toast.error('Please fill in all required fields');
        handleResetState(setEditedData);
        return;
      }

      // setIsLoading(true);

      let url: string =
        process.env.NEXT_PUBLIC_BASE_URL + '/api/store?action=edit-store';
      let options: {} = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ storeId, editedData }),
      };

      let response = await fetchData(url, options);

      if (response.ok) {
        toast.success('Store data edited successfully');
        handleResetState(setEditedData);
        getAllStores();
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
    getAllStores();
  }, []);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2 items-center">
        <h2 className="text-3xl font-semibold">Stores List</h2>
        <CreateButton isLoading={isLoading} submitHandler={createNewStore} />
      </div>

      {isLoading && <p className="text-center">Loading...</p>}

      {!isLoading && (
        <div className="table-responsive text-nowrap text-sm">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="font-bold">S/N</th>
                <th className="font-bold">Name</th>
                <th className="font-bold">Manager</th>
                <th className="font-bold">Phone</th>
                <th className="font-bold">Location</th>
                <th className="font-bold">Status</th>
                {session?.user?.role === 'administrator' && (
                  <th className="font-bold">Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {stores.length !== 0 ? (
                stores.map((item: StoreDataTypes, index: number) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.manager}</td>
                    <td className="capitalize">{item.phone}</td>
                    <ExtendableTd data={item.location || ''} />
                    <td className="capitalize">{item.status}</td>
                    {session?.user?.role === 'administrator' && (
                      <td
                        className="text-center"
                        style={{ verticalAlign: 'middle' }}
                      >
                        <div className="inline-block">
                          <div className="flex gap-2">
                            <EditButton
                              isLoading={isLoading}
                              storeData={item}
                              submitHandler={editStore}
                            />
                            <DeleteButton
                              storeData={item}
                              submitHandler={deleteStore}
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
                    colSpan={session?.user?.role === 'administrator' ? 7 : 6}
                    className="align-center text-center"
                  >
                    No Store To Show.
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
