'use client';
import React, { useEffect } from 'react';

import 'flowbite';
import { initFlowbite } from 'flowbite';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

interface TopbarProps {
  avatarURI: string;
}

const Topbar: React.FC<TopbarProps> = ({ avatarURI }) => {
  useEffect(() => {
    initFlowbite();
  }, []);
  const { data: session } = useSession();
  return (
    <header className="fixed top-0 z-50 w-full bg-gray-800 border-b border-gray-600 text-white">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start gap-6">
            <button
              data-drawer-target="logo-sidebar"
              data-drawer-toggle="logo-sidebar"
              aria-controls="logo-sidebar"
              type="button"
              className="inline-flex sm:hidden items-center text-sm focus:outline-none"
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6 fill-gray-500 hover:fill-gray-100"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                ></path>
              </svg>
            </button>
            <Image
              src="/images/khalek-molla-high-resolution-logo-white-transparent.png"
              alt="logo"
              width={160}
              height={30}
              style={{
                objectFit: 'contain',
                objectPosition: 'center',
                width: '160px',
                height: '30px',
              }}
            />
          </div>
          <div className="flex items-center">
            <div className="flex items-center ms-3">
              <div className="flex gap-2 items-center justify-end">
                <div className="hidden sm:inline-block leading-[0]">
                  <h3 className="uppercase font-semibold name text-lg leading-tight text-wrap">
                    {session?.user.full_name}
                  </h3>
                  <p className="role capitalize text-sm leading-tight">
                    {session?.user.role}
                  </p>
                </div>

                <Link
                  href="/account"
                  className="cursor-pointer select-none account-settings has-tooltip text-xs"
                >
                  <Image
                    className="rounded-full border object-cover select-none avatar w-[40px] h-[40px]"
                    src={avatarURI}
                    alt="user_avatar"
                    width={40}
                    height={40}
                  />

                  <span className="tooltip italic font-medium rounded-sm text-xs shadow-lg p-1 px-2 bg-gray-100 text-black ml-2">
                    Settings
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
