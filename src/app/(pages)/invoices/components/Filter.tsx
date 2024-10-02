'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { getAllInvoices, getAllInvoicesFiltered } from '../actions';
import { InvoicesState } from './Table';

const validationSchema = z.object({
  searchText: z.string().min(1, { message: 'Search text is required' }),
});

type FilterTypes = z.infer<typeof validationSchema>;

interface PropsType {
  page: number;
  itemsPerPage: number;
  setFilters: React.Dispatch<React.SetStateAction<FilterTypes>>;
  setIsFiltered: React.Dispatch<React.SetStateAction<boolean>>;
  setInvoices: React.Dispatch<React.SetStateAction<InvoicesState>>;
}

const FilterButton: React.FC<PropsType> = ({
  page,
  itemsPerPage,
  setFilters,
  setIsFiltered,
  setInvoices,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const popupRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FilterTypes>({
    resolver: zodResolver(validationSchema),
    defaultValues: { searchText: '' },
  });

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(e.target as Node) &&
      !popupRef.current.querySelector('input:focus')
    ) {
      setIsOpen(false);
    }
  };

  const formSubmit = async (): Promise<void> => {
    try {
      setLoading(true);
      const searchText = watch('searchText');
      const response = searchText
        ? await getAllInvoicesFiltered({
            page: 1,
            itemsPerPage,
            filters: { searchText },
          })
        : await getAllInvoices({ page, itemsPerPage });

      if (response?.error) {
        toast.error(response?.message || 'Error fetching suppliers');
      } else {
        setInvoices(JSON.parse(response.message));
        setIsFiltered(!!searchText);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while retrieving suppliers data');
    } finally {
      setLoading(false);
      setFilters({ searchText: watch('searchText') });
    }
  };

  return (
    <>
      <button
        disabled={loading}
        onClick={() => setIsOpen(true)}
        type="button"
        className="flex items-center gap-2 rounded-sm bg-blue-600 hover:opacity-90 hover:ring-4 hover:ring-blue-600 transition duration-200 delay-300 hover:text-opacity-100 text-white px-3 py-2"
      >
        Filter
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z" />
        </svg>
      </button>

      <section
        onClick={handleClickOutside}
        className={`fixed z-50 inset-0 flex justify-center items-center transition-colors ${isOpen ? 'visible bg-black/20 disable-page-scroll' : 'invisible'} `}
      >
        <article
          ref={popupRef}
          onClick={e => e.stopPropagation()}
          className={`${isOpen ? 'scale-100 opacity-100' : 'scale-125 opacity-0'} bg-white rounded-sm lg:w-[35vw] md:w-[70vw] sm:w-[80vw] shadow relative`}
        >
          <header className="flex items-center align-middle justify-between px-4 py-2 border-b rounded-t">
            <h3 className="text-gray-900 text-lg lg:text-xl font-semibold dark:text-white uppercase">
              Filter Invoices
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-sm text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </header>
          <form
            action={formSubmit}
            ref={formRef}
            className="overflow-x-hidden overflow-y-scroll max-h-[70vh] p-4 text-start"
            onSubmit={handleSubmit(formSubmit)}
          >
            <div className="w-full">
              <label className="tracking-wide text-gray-700 text-sm font-bold block mb-2 ">
                <span className="uppercase">Search Text*</span>
                <span className="text-red-700 text-wrap block text-xs">
                  {errors.searchText && errors.searchText.message}
                </span>
              </label>

              <input
                placeholder="Search for any text"
                {...register('searchText')}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
            </div>
          </form>
          <footer className="flex space-x-2 items-center px-4 py-2 border-t justify-end border-gray-200 rounded-b">
            <button
              onClick={() => {
                reset();
                formSubmit();
              }}
              className="rounded-sm bg-gray-600 text-white  hover:opacity-90 hover:ring-2 hover:ring-gray-600 transition duration-200 delay-300 hover:text-opacity-100 px-4 py-2 uppercase"
              type="button"
              disabled={loading}
            >
              Reset
            </button>
            <button
              disabled={loading}
              onClick={() => {
                formRef.current?.requestSubmit();
              }}
              className="rounded-sm bg-blue-600 text-white   hover:opacity-90 hover:ring-2 hover:ring-blue-600 transition duration-200 delay-300 hover:text-opacity-100 px-4 py-2 uppercase"
              type="button"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </footer>
        </article>
      </section>
    </>
  );
};

export default FilterButton;
