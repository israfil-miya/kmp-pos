import React from 'react';

import { auth } from '@/auth';
import crypto from 'crypto';
import Image from 'next/image';
import Link from 'next/link';

async function sha256(message: string) {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message);

  // hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // convert bytes to hex string
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

async function Profile() {
  const session = await auth();
  const avatarURI =
    'https://gravatar.com/avatar/' +
    (await sha256(
      session?.user.email.trim().toLowerCase() || 'johndoe@pos.com',
    )) +
    '/?s=400&d=identicon&r=x';

  return (
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
  );
}

export default Profile;
