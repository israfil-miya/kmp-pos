'use client';

import { Dropdown } from 'flowbite';
import React, { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function SearchInput() {
  const searchInput = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dropdownInstance = useRef<Dropdown | null>(null);
  const [search, setSearch] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // debounce the search value
  const [debouncedSearch] = useDebounce(search, 400);

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

    window.addEventListener('keydown', keyDownHandler);

    return () => {
      window.removeEventListener('keydown', keyDownHandler);
      dropdownInstance.current?.hide();
    };
  }, []);

  const handleFocusOrClick = () => {
    if (!isDropdownVisible) dropdownInstance.current?.show();
  };

  const handleBlur = (e: React.FocusEvent) => {
    setTimeout(() => {
      if (!searchInput.current?.contains(document.activeElement)) {
        dropdownInstance.current?.hide();
      }
    }, 0);
  };

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
          type="text"
          className="block w-full p-4 ps-10 sm:pe-24 text-sm text-gray-900 border border-gray-300 rounded bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search products by batch, name and category"
          required
          onChange={e => setSearch(e.target.value)}
          name="search"
          autoComplete="off"
          onFocus={handleFocusOrClick}
          onBlur={handleBlur}
          onClick={handleFocusOrClick}
        />
        <div className="hidden sm:absolute inset-y-0 end-0 sm:flex items-center pe-3 space-x-1">
          <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">
            Ctrl
          </kbd>
          <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">
            K
          </kbd>
        </div>
      </div>
      <div
        id="searchDropdown"
        ref={dropdownRef}
        className={`z-10 ${isDropdownVisible ? 'block' : 'hidden'} bg-white divide-y divide-gray-100 rounded shadow absolute left-0 mt-2`}
      >
        <div className="p-4 text-sm">
          <p className="text-center">
            {debouncedSearch.length !== 0
              ? 'No products found!'
              : 'Start typing to search...'}
          </p>
        </div>
      </div>
    </div>
  );
}
