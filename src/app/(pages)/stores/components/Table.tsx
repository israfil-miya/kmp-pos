'use client';

import ExtendableTd from '@/components/ExtendableTd';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FormState } from '../actions';
import { StoreDataTypes } from '../schema';
import CreateButton from './Create';
import DeleteButton from './Delete';
import EditButton from './Edit';

const Table: React.FC<{ data: FormState }> = ({ data }) => {
  const [stores, setStores] = useState<StoreDataTypes[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (data.error) {
      if (data?.message !== '') {
        toast.error(data.message);
      }
    } else if (data?.message !== '') {
      setStores(JSON.parse(data.message));
    } else {
      console.log('Nothing was returned from the server');
    }
  }, [data]);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2 items-center">
        <h2 className="text-3xl font-semibold">Stores List</h2>
        <CreateButton />
      </div>

      <div className="table-responsive text-nowrap text-sm">
        <table className="table table-bordered table-striped">
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
                          <EditButton storeData={item} />
                          <DeleteButton storeData={item} />
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
