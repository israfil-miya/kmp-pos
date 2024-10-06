'use client';

import cn from '@/utility/cn';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { getAllProducts, getAllProductsFiltered } from '../actions';
import { ProductSortEnum } from '../schema';
import { ProductsState } from './Table';

interface PropsType {
  page: number;
  itemsPerPage: number;
  setSortBy: React.Dispatch<React.SetStateAction<ProductSortEnum>>;
  sortBy: ProductSortEnum;
  setIsFiltered: React.Dispatch<React.SetStateAction<boolean>>;
  setProducts: React.Dispatch<React.SetStateAction<ProductsState>>;
  filters: { searchText: string };
}

const schema = z.object({
  sortBy: z.nativeEnum(ProductSortEnum).optional(),
});

type FormData = z.infer<typeof schema>;

const SortButton: React.FC<PropsType> = ({
  page,
  itemsPerPage,
  setSortBy,
  sortBy,
  setIsFiltered,
  filters,
  setProducts,
}) => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { handleSubmit, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      sortBy: sortBy,
    },
  });

  const sortOptions = Object.values(ProductSortEnum).map(value => ({
    label: formatSortLabel(value),
    value,
  }));

  function formatSortLabel(value: ProductSortEnum): string {
    switch (value) {
      case ProductSortEnum.StockAsc:
        return 'Stock Asc';
      case ProductSortEnum.StockDesc:
        return 'Stock Desc';
      case ProductSortEnum.StatusInStockFirst:
        return 'Status Asc';
      case ProductSortEnum.StatusOutOfStockFirst:
        return 'Status Desc';
      case ProductSortEnum.ExpirySoonToLater:
        return 'Expiry Asc';
      case ProductSortEnum.ExpiryLaterToSoon:
        return 'Expiry Desc';
      case ProductSortEnum.AddedAsc:
        return 'Added Asc';
      case ProductSortEnum.AddedDesc:
        return 'Added Desc';
      default:
        return 'Sort';
    }
  }

  const onSortChange = async (data: FormData): Promise<void> => {
    try {
      setLoading(true);
      const selectedSort = data.sortBy || ProductSortEnum.AddedDesc;

      const response = filters?.searchText
        ? await getAllProductsFiltered({
            page: 1,
            itemsPerPage,
            filters: filters,
            sortBy: selectedSort,
          })
        : await getAllProducts({ page, itemsPerPage, sortBy: selectedSort });

      if (response?.error) {
        toast.error(response?.message || 'Error fetching products');
      } else {
        setProducts(JSON.parse(response.message));
        setIsFiltered(!!filters?.searchText);
        setSortBy(selectedSort);
        toast.success('Products sorted successfully');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while retrieving products data');
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="flex items-center gap-2 rounded-sm bg-blue-600 hover:opacity-90 hover:ring-4 hover:ring-blue-600 transition duration-200 delay-300 hover:text-opacity-100 text-white px-3 py-2 focus:outline-none"
      >
        Sort
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M14 10.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 .5-.5m0-3a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0 0 1h7a.5.5 0 0 0 .5-.5m0-3a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0 0 1h11a.5.5 0 0 0 .5-.5" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white divide-y divide-gray-100 rounded shadow min-w-max max-h-[10rem] overflow-y-auto">
          <ul className="py-2 text-sm text-gray-700">
            {sortOptions.map(option => (
              <li key={option.value}>
                <button
                  className={cn(
                    'block px-4 py-2 w-full text-left',
                    option.value === sortBy
                      ? ' bg-blue-500 text-white'
                      : 'hover:bg-blue-100 hover:text-black',
                  )}
                  onClick={() => {
                    setValue('sortBy', option.value);
                    handleSubmit(onSortChange)();
                  }}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SortButton;
