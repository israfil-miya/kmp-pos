'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CreateButton from './Create';
import fetchData from '@/utility/fetchdata';
import { toast } from 'sonner';
import ExtendableTd from '@/components/ExtendableTd';

interface UserDataTypes {
  full_name: string;
  email: string;
  role: string;
  warehouse: string;
  phone: string;
  note: string;
  password: string;
}

type UsersState = {
  pagination: {
    count: number;
    pageCount: number;
  };
  items: { [key: string]: any }[];
};

const Table = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<{ [key: string]: any }[]>([{}]);

  const createNewUser = async (
    userData: UserDataTypes,
    setUserData: React.Dispatch<React.SetStateAction<UserDataTypes>>,
  ): Promise<void> => {
    try {
      setIsLoading(true);

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
        setUserData({
          full_name: '',
          email: '',
          role: '',
          warehouse: '',
          phone: '',
          note: '',
          password: '',
        });
        toast.success('New report added successfully');
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

  async function getAllUsers() {
    try {
      setIsLoading(true);

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
  }

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

      {!isLoading &&
        (users?.length !== 0 ? (
          <div className="table-responsive text-nowrap text-sm">
            <table className="table border">
              <thead>
                <tr>
                  <th className="font-bold">S/N</th>
                  <th className="font-bold">Full Name</th>
                  <th className="font-bold">Email</th>
                  <th className="font-bold">Role</th>
                  <th className="font-bold">Store</th>
                  <th className="font-bold">Note</th>
                  <th className="font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((item: any, index: number) => {
                  return (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.full_name}</td>
                      <td>{item.email}</td>
                      <td className="capitalize">{item.role}</td>
                      <td className="capitalize">{item.warehouse}</td>
                      <ExtendableTd data={item.note} />
                      <td
                        className="text-center"
                        style={{ verticalAlign: 'middle' }}
                      >
                        <div className="inline-block">
                          <div className="flex gap-2">
                            <button>Edit</button>
                            <button>Delete</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <tr key={0}>
            <td colSpan={7} className="align-center text-center">
              No Users To Show.
            </td>
          </tr>
        ))}
    </>
  );
};

export default Table;
