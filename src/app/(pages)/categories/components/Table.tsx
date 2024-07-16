'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type CategoriesState = {
  pagination: {
    count: number;
    pageCount: number;
  };
  items: { [key: string]: any }[];
};

const Table = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [categories, setCategories] = useState<CategoriesState>({
    pagination: {
      count: 0,
      pageCount: 0,
    },
    items: [],
  });

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2 items-center">
        <h2 className="text-3xl font-semibold">Product Category List</h2>
        <button
          onClick={() => router.push('/make-a-call')}
          className="flex justify-between items-center gap-2 rounded-md bg-blue-600 hover:opacity-90 hover:ring-4 hover:ring-blue-600 transition duration-200 delay-300 hover:text-opacity-100 text-white p-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
          </svg>
          Add Category
        </button>
      </div>

      {isLoading ? <p className="text-center">Loading...</p> : <></>}

      {!isLoading && (
        <div className="table-responsive text-nowrap">
          <table className="table border">
            <thead>
              <tr>
                <th className="font-bold">S/N</th>
                <th className="font-bold">Category Name</th>
                <th className="font-bold">Created At</th>
                <th className="font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {categories?.items?.length !== 0 ? (
                <>
                  {/* {reports?.items?.map((item, index) => {
                  let tableRowColor = 'table-secondary';

                  if (item.is_prospected) {
                    if (item?.prospect_status == 'high_interest') {
                      tableRowColor = 'table-success';
                    } else if (item?.prospect_status == 'low_interest') {
                      tableRowColor = 'table-warning';
                    }
                  } else {
                    tableRowColor = 'table-danger';
                  }

                  return (
                    <tr
                      key={item._id}
                      className={tableRowColor ? tableRowColor : ''}
                    >
                      <td>{index + 1 + itemPerPage * (page - 1)}</td>
                      <td>
                        {item.calling_date &&
                          convertToDDMMYYYY(item.calling_date)}
                      </td>
                      <td>
                        {item.followup_date &&
                          convertToDDMMYYYY(item.followup_date)}
                      </td>

                      <td>{item.country}</td>
                      <td>
                        {item.website.length ? (
                          <Linkify
                            coverText="Click here to visit"
                            data={item.website}
                          />
                        ) : (
                          'No link provided'
                        )}
                      </td>
                      <td>{item.category}</td>
                      <td className="text-wrap">{item.company_name}</td>
                      <td className="text-wrap">{item.contact_person}</td>
                      <td>{item.designation}</td>
                      <td className="text-wrap">{item.contact_number}</td>
                      <td className="text-wrap">{item.email_address}</td>
                      <CallingStatusTd data={item.calling_status} />
                      <td>
                        {item.linkedin.length ? (
                          <Linkify
                            coverText="Click here to visit"
                            data={item.linkedin}
                          />
                        ) : (
                          'No link provided'
                        )}
                      </td>
                      <td>
                        {item.test_given_date_history?.length ? 'Yes' : 'No'}
                      </td>
                      <td>
                        {item.is_prospected
                          ? `Yes (${item.followup_done ? 'Done' : 'Pending'})`
                          : 'No'}
                      </td>
                      <td
                        className="text-center"
                        style={{ verticalAlign: 'middle' }}
                      >
                        <div className="inline-block">
                          <div className="flex gap-2">
                            <EditButton
                              isLoading={isLoading}
                              submitHandler={editReport}
                              reportData={item}
                            />
                            <DeleteButton
                              submitHandler={deleteReport}
                              reportData={item}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })} */}
                </>
              ) : (
                <tr key={0}>
                  <td colSpan={4} className="align-center text-center">
                    No Category To Show.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Table;
