'use client';

import cn from '@/utility/cn';
import { formatDate, getTimeFromISODate as getTime } from '@/utility/date';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FormState } from '../../invoices/actions';
import { InvoiceDataTypes } from '../../pos/schema';

export interface InvoicesState {
  pagination?: {
    count: number;
    pageCount: number;
  };
  items?: InvoiceDataTypes[];
}

const Table: React.FC<{ invoices: FormState }> = props => {
  const [invoices, setInvoices] = useState<InvoicesState>({
    pagination: {
      count: 0,
      pageCount: 0,
    },
    items: [],
  });

  useEffect(() => {
    if (props.invoices.error) {
      if (props.invoices?.message !== '') {
        toast.error(props.invoices.message);
      }
    } else if (props.invoices?.message !== '') {
      setInvoices(JSON.parse(props.invoices.message));
    } else {
      console.log('Nothing was returned from the server');
    }
  }, [props.invoices]);

  return (
    <>
      <p className="mt-4 text-xl font-semibold">Last Transactions</p>
      <div className="table-responsive text-nowrap text-sm">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th className="font-bold">S/N</th>
              <th className="font-bold">ID</th>
              <th className="font-bold">Date</th>
              <th className="font-bold">Customer</th>
              <th className="font-bold">Cashier</th>
              <th className="font-bold">Store</th>
              <th className="font-bold">Bill</th>
              <th className="font-bold">Discount</th>
              <th className="font-bold">Payable</th>
              <th className="font-bold">Paid</th>
              <th className="font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices?.items?.length !== 0 ? (
              invoices?.items?.map((item: InvoiceDataTypes, index: number) => (
                <tr key={String(item._id)}>
                  <td>{index + 1}</td>
                  <td>{item.invoice_no}</td>
                  <td>
                    {' '}
                    {item?.createdAt ? formatDate(item?.createdAt) : null}
                    <br />
                    {item?.createdAt
                      ? getTime(item?.createdAt as string)
                      : null}
                  </td>
                  <td className="capitalize">{item.customer.name}</td>
                  <td
                    className="uppercase items-center"
                    style={{ verticalAlign: 'middle' }}
                  >
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400"
                    >
                      {item.cashier}
                    </span>
                  </td>
                  <td
                    className="uppercase items-center"
                    style={{ verticalAlign: 'middle' }}
                  >
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400"
                    >
                      {item.store_name}
                    </span>
                  </td>
                  <td>{item.sub_total?.toLocaleString() || '0'} ৳</td>
                  <td>{item.discount_amount?.toLocaleString() || '0'} ৳</td>
                  <td>{item.grand_total?.toLocaleString() || '0'} ৳</td>
                  <td>{item.paid_amount?.toLocaleString() || '0'} ৳</td>
                  <td
                    className="uppercase items-center"
                    style={{ verticalAlign: 'middle' }}
                  >
                    <span
                      key={index}
                      className={cn(
                        'text-xs font-medium px-2.5 py-0.5 rounded border',
                        item.grand_total === item.paid_amount
                          ? 'bg-green-100 text-green-800 border-green-400'
                          : 'bg-red-100 text-yellow-800 border-yellow-400',
                      )}
                    >
                      {item.grand_total === item.paid_amount ? 'Paid' : 'Due'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr key={0}>
                <td className="align-center text-center">
                  No Transaction To Show.
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
