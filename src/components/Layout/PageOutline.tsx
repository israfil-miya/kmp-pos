import { auth } from '@/auth';
import LogoutAction from '@/components/Logout/LogoutAction';
import { SessionProvider } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import crypto from 'node:crypto';
import { ReactNode } from 'react';
import Nav from './Nav';
import Timecard from './TimeCard';

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

interface OutlineProps {
  children: ReactNode;
}

const Outline: React.FC<OutlineProps> = async ({ children }) => {
  const session = await auth();
  const avatarURI =
    'https://gravatar.com/avatar/' +
    (await sha256(
      session?.user.email.trim().toLowerCase() || 'johndoe@pos.com',
    )) +
    '/?s=400&d=identicon&r=x';

  return (
    <>
      <div className="flex flex-col">
        <header className="w-full border-b border-gray-600 px-10 h-[72px] bg-gray-800 text-white flex flex-row justify-between items-center shadow-[0_4px_6px_rgba(0,0,0,0.06)]">
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
        <div className="flex flex-grow">
          <aside className="bg-gray-800 w-56 h-[calc(100vh-72px)] overflow-auto text-white gap-6 pb-2 flex-col flex shadow-[4px_0px_10px_rgba(0,0,0,0.06)]">
            <Nav LogoutAction={LogoutAction} />
          </aside>

          <main className="mx-10 my-10 w-full h-full">{children}</main>
        </div>
      </div>
    </>
  );
};

export default Outline;
