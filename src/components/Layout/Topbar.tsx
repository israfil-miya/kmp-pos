'use client';
import React from 'react';

import { auth } from '@/auth';
import crypto from 'crypto';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import Hamburger from './HamburgerMenu';

interface TopbarProps {
  avatarURI: string;
}

const Topbar: React.FC<TopbarProps> = ({ avatarURI }) => {
  const { data: session } = useSession();
  return (
    <header className="w-full border-b border-gray-600 px-10 h-[72px] bg-gray-800 text-white flex flex-row justify-between items-center shadow-[0_4px_6px_rgba(0,0,0,0.06)]">
      <Hamburger className="block lg:hidden" />

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

      <div className="flex gap-2 items-center">
        <div className="flex flex-col gap-0 leading-3">
          <h1 className="uppercase font-semibold name text-xl text-wrap">
            {session?.user.full_name}
          </h1>
          <p className="role capitalize">{session?.user.role}</p>
        </div>
        <Link
          href="/account"
          className="cursor-pointer select-none account-settings has-tooltip text-xs"
        >
          <Image
            className="rounded-full border object-cover select-none avatar w-[50px] h-[50px]"
            src={avatarURI}
            alt="user_avatar"
            width={50}
            height={50}
          />

          <span className="tooltip italic font-medium rounded-sm text-xs shadow-lg p-1 px-2 bg-gray-100 text-black ml-2">
            Settings
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Topbar;
