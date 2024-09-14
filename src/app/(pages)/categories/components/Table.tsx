'use client';

import ExtendableTd from '@/components/ExtendableTd';
import { ISO_to_DD_MM_YY as convertToDDMMYYYY } from '@/utility/dateConversion';
import moment from 'moment-timezone';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FormState } from '../actions';
import { CategoryDataTypes } from '../schema';
import CreateButton from './Create';
import DeleteButton from './Delete';
import EditButton from './Edit';

let Table: React.FC<{ data: FormState }> = ({ data }) => {
  const [categories, setCategories] = useState<CategoryDataTypes[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (data.error) {
      if (data?.message !== '') {
        toast.error(data.message);
      }
    } else if (data?.message !== '') {
      setCategories(JSON.parse(data.message));
    } else {
      console.log('Nothing was returned from the server');
    }
  }, [data]);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2 items-center">
        <h2 className="text-3xl font-semibold">Product Category List</h2>
        <CreateButton />
      </div>

      <div className="table-responsive text-nowrap text-sm">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th className="font-bold">S/N</th>
              <th className="font-bold">Category Name</th>
              <th className="font-bold">Creation Date</th>
              {session?.user?.role === 'administrator' && (
                <th className="font-bold">Action</th>
              )}
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
                          <EditButton categoryData={item} />
                          <DeleteButton categoryData={item} />
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
