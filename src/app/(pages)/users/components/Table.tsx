'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CreateButton from './Create';
import fetchData from '@/utility/fetchdata';
import { toast } from 'sonner';
import ExtendableTd from '@/components/ExtendableTd';
import DeleteButton from './Delete';
import { useSession } from 'next-auth/react';
import UserDataTypes from './UserDataTypes';
import EditButton from './Edit';

const Table = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<UserDataTypes[]>([]);
  const { data: session } = useSession();

  const createNewUser = async (
    userData: UserDataTypes,
    setUserData: React.Dispatch<React.SetStateAction<UserDataTypes>>,
  ): Promise<void> => {
    try {
      if (
        userData.full_name === '' ||
        userData.email === '' ||
        userData.role === '' ||
        userData.password === ''
      ) {
        toast.error('Please fill in all required fields');
        return;
      }

      // setIsLoading(true);

      let url: string =
        process.env.NEXT_PUBLIC_BASE_URL + '/api/user?action=create-new-user';
      let options: {} = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      };

      let response = await fetchData(url, options);

      if (response.ok) {
        toast.success('New user added successfully');
        setUserData({});
        getAllUsers();
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

  const getAllUsers = async (): Promise<void> => {
    try {
      // setIsLoading(true);

      let url: string =
        process.env.NEXT_PUBLIC_BASE_URL + '/api/user?action=get-all-users';
      let options: {} = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      let response = await fetchData(url, options);

      if (response.ok) {
        setUsers(response.data);
      } else {
        toast.error(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while retrieving users data');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (userData: {
    [key: string]: any;
  }): Promise<void> => {
    try {
      // setIsLoading(true);

      let url: string =
        process.env.NEXT_PUBLIC_BASE_URL + '/api/user?action=delete-user';
      let options: {} = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userData._id }),
      };

      let response = await fetchData(url, options);

      if (response.ok) {
        toast.success('User deleted successfully');
        getAllUsers();
      } else {
        toast.error(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while deleting the user');
    } finally {
      setIsLoading(false);
    }
  };

  const editUser = async (
    userId: string | undefined,
    userData: UserDataTypes,
    editedData: UserDataTypes,
    setEditedData: React.Dispatch<React.SetStateAction<UserDataTypes>>,
  ): Promise<void> => {
    try {
      // setIsLoading(true);

      let url: string =
        process.env.NEXT_PUBLIC_BASE_URL + '/api/user?action=edit-user';
      let options: {} = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, editedData }),
      };

      let response = await fetchData(url, options);

      if (response.ok) {
        toast.success('User data edited successfully');
        setEditedData({});
        getAllUsers();
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
    getAllUsers();
  }, []);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2 items-center">
        <h2 className="text-3xl font-semibold">Users List</h2>
        <CreateButton isLoading={isLoading} submitHandler={createNewUser} />
      </div>

      {isLoading && <p className="text-center">Loading...</p>}

      {!isLoading && (
        <div className="table-responsive text-nowrap text-sm">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="font-bold">S/N</th>
                <th className="font-bold">Full Name</th>
                <th className="font-bold">Email</th>
                <th className="font-bold">Role</th>
                <th className="font-bold">Store</th>
                <th className="font-bold">Phone</th>
                <th className="font-bold">Note</th>
                {session?.user?.role === 'administrator' && (
                  <th className="font-bold">Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {users.length !== 0 ? (
                users.map((item: any, index: number) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.full_name}</td>
                    <td>{item.email}</td>
                    <td className="capitalize">{item.role}</td>
                    <td className="capitalize">{item.store}</td>
                    <td>{item.phone}</td>
                    <ExtendableTd data={item.note} />
                    {session?.user?.role === 'administrator' && (
                      <td
                        className="text-center"
                        style={{ verticalAlign: 'middle' }}
                      >
                        <div className="inline-block">
                          <div className="flex gap-2">
                            <EditButton
                              isLoading={isLoading}
                              userData={item}
                              submitHandler={editUser}
                            />
                            <DeleteButton
                              userData={item}
                              submitHandler={deleteUser}
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
                    className=" align-center text-center"
                  >
                    No Users To Show.
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
