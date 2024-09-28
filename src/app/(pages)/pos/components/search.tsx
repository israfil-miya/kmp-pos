'use client';

import { Dropdown } from 'flowbite';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { POSContext } from '../POSContext';
import SearchedProducts from './products';

export default function SearchInput() {
  const searchInput = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dropdownInstance = useRef<Dropdown | null>(null);
  const [search, setSearch] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  let context = useContext(POSContext);

  useEffect(() => {
    if (dropdownRef.current && searchInput.current) {
      dropdownInstance.current = new Dropdown(
        dropdownRef.current,
        searchInput.current,
        {
          placement: 'bottom',
          triggerType: 'click',
          offsetSkidding: 0,
          offsetDistance: 5,
          delay: 300,
          onShow: () => {
            setIsDropdownVisible(true);
            if (dropdownRef.current && searchInput.current) {
              dropdownRef.current.style.width = `${searchInput.current.offsetWidth}px`;
              dropdownRef.current.style.left = `${searchInput.current.offsetLeft}px`;
            }
          },
          onHide: () => {
            setIsDropdownVisible(false);
          },
        },
      );
    }

    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        searchInput.current?.focus();
        dropdownInstance.current?.show();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        searchInput.current &&
        !searchInput.current.contains(event.target as Node)
      ) {
        dropdownInstance.current?.hide();
      }
    };

    window.addEventListener('keydown', keyDownHandler);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('mousedown', handleClickOutside);
      dropdownInstance.current?.hide();
    };
  }, []);

  const handleFocus = () => {
    dropdownInstance.current?.show();
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isDropdownVisible) {
      dropdownInstance.current?.show();
    }
  };
  // Update the context when debounced search value changes
  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    if (value) {
      context?.setSearch(value);
    } else {
      context?.setSearch('');
    }
  }, 600);

  useEffect(() => {
    debouncedSetSearch(search || '');
  }, [search, debouncedSetSearch]);

  return (
    <div className="w-full relative">
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only"
      >
        Search
      </label>
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          ref={searchInput}
          id="searchDropdownButton"
          data-dropdown-toggle="searchDropdown"
          type="text"
          className="block w-full p-4 ps-10 pe-24 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search products by batch, name and category"
          required
          onChange={e => {
            setSearch(e.target.value);
          }}
          autoComplete="off"
          onFocus={handleFocus}
          onClick={handleInputClick}
        />
        <div className="hidden sm:absolute inset-y-0 end-0 sm:flex items-center pe-3 space-x-1">
          <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">
            Ctrl
          </kbd>
          <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">
            k
          </kbd>
        </div>
      </div>
      <div
        id="searchDropdown"
        ref={dropdownRef}
        className={`z-50 ${isDropdownVisible ? 'block' : 'hidden'} pt-4 px-4 text-sm bg-white divide-y divide-gray-100 rounded shadow absolute left-0 mt-2`}
      >
        <SearchedProducts />
      </div>
    </div>
  );
}
