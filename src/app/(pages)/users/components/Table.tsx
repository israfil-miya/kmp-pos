'use client';

import ExtendableTd from '@/components/ExtendableTd';
import fetchData from '@/utility/fetchData';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { toast } from 'sonner';
import { FormState } from '../actions';
import { UserDataTypes } from '../schema';
import CreateButton from './Create';
import DeleteButton from './Delete';
import EditButton from './Edit';

interface TableDataProps {
  data: FormState;
  storeNames: FormState;
}

let Table: React.FC<TableDataProps> = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<UserDataTypes[]>([]);
  const [storeNames, setStoreNames] = useState<string[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (props.data.error) {
      if (props.data?.message !== '') {
        toast.error(props.data.message);
      }
    } else if (props.data?.message !== '') {
      setUsers(JSON.parse(props.data.message));
    } else {
      console.log('Nothing was returned from the server');
    }
  }, [props.data]);

  useEffect(() => {
    if (props.storeNames.error) {
      if (props.storeNames?.message !== '') {
        toast.error(props.storeNames.message);
      }
    } else if (props.storeNames?.message !== '') {
      setStoreNames(JSON.parse(props.storeNames.message));
    } else {
      console.log('Nothing was returned from the server');
    }
  }, [props.storeNames]);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between gap-2 mb-4">
        <h2 className="text-3xl font-semibold text-gray-800">Users List</h2>
        <div className="w-full sm:w-auto">
          <CreateButton storeNames={storeNames} />
        </div>
      </div>

      {isLoading && <p className="text-center">Loading...</p>}

      {!isLoading && (
        <div className="table-responsive text-nowrap text-sm">
          <table className="table table-bordered table-striped">
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
                users.map((item: UserDataTypes, index: number) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td className="text-wrap">{item.full_name}</td>
                    <td>{item.email}</td>
                    <td className="capitalize">{item.role}</td>
                    <td className="capitalize">{item.store}</td>
                    <td>{item.phone}</td>
                    <ExtendableTd data={item.note || ''} />
                    {session?.user?.role === 'administrator' && (
                      <td
                        className="text-center"
                        style={{ verticalAlign: 'middle' }}
                      >
                        <div className="inline-block">
                          <div className="flex gap-2">
                            <EditButton
                              userData={item}
                              storeNames={storeNames}
                            />
                            <DeleteButton userData={item} />
                          </div>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr key={0}>
                  <td
                    colSpan={session?.user?.role === 'administrator' ? 8 : 7}
                    className="align-center text-center"
                  >
                    No User To Show.
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
