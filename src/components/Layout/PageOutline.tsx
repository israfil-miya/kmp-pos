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
      <div className="flex flex-col h-screen">
        <div className="flex flex-grow">
          <SessionProvider session={session}>
            <aside className="bg-gray-800 w-56 text-white gap-6 pt-6 pb-2 flex-col flex shadow-[4px_0px_10px_rgba(0,0,0,0.06)] overflow-y-auto">
              <div className="flex flex-col gap-2 mb-2 mt-2 items-center text-nowrap">
                <Image
                  src="/images/khalek-molla-high-resolution-logo-white-transparent.png"
                  alt="logo"
                  width={140}
                  height={140}
                />
                {/* <h1 className="font-serif uppercase">Khalek Molla Plaza</h1> */}
              </div>
              <Nav LogoutAction={LogoutAction} />
            </aside>
            <div className="flex-grow">
              <header className="w-full px-10 py-2 flex flex-row justify-between items-center shadow-[0_4px_6px_rgba(0,0,0,0.06)]">
                {/* <div className="flex gap-2 items-center p-4 bg-yellow-400 bg-opacity-30 text-xl font-semibold rounded-md">
                POS (Point of Sales) - v1.0
              </div> */}

                {/* <Timecard /> */}

                <Link
                  href="/account"
                  className="cursor-pointer select-none account-settings has-tooltip text-xs"
                >
                  <svg
                    className="w-8 h-8"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M7.068.727c.243-.97 1.62-.97 1.864 0l.071.286a.96.96 0 0 0 1.622.434l.205-.211c.695-.719 1.888-.03 1.613.931l-.08.284a.96.96 0 0 0 1.187 1.187l.283-.081c.96-.275 1.65.918.931 1.613l-.211.205a.96.96 0 0 0 .434 1.622l.286.071c.97.243.97 1.62 0 1.864l-.286.071a.96.96 0 0 0-.434 1.622l.211.205c.719.695.03 1.888-.931 1.613l-.284-.08a.96.96 0 0 0-1.187 1.187l.081.283c.275.96-.918 1.65-1.613.931l-.205-.211a.96.96 0 0 0-1.622.434l-.071.286c-.243.97-1.62.97-1.864 0l-.071-.286a.96.96 0 0 0-1.622-.434l-.205.211c-.695.719-1.888.03-1.613-.931l.08-.284a.96.96 0 0 0-1.186-1.187l-.284.081c-.96.275-1.65-.918-.931-1.613l.211-.205a.96.96 0 0 0-.434-1.622l-.286-.071c-.97-.243-.97-1.62 0-1.864l.286-.071a.96.96 0 0 0 .434-1.622l-.211-.205c-.719-.695-.03-1.888.931-1.613l.284.08a.96.96 0 0 0 1.187-1.186l-.081-.284c-.275-.96.918-1.65 1.613-.931l.205.211a.96.96 0 0 0 1.622-.434zM12.973 8.5H8.25l-2.834 3.779A4.998 4.998 0 0 0 12.973 8.5m0-1a4.998 4.998 0 0 0-7.557-3.779l2.834 3.78zM5.048 3.967l-.087.065zm-.431.355A4.98 4.98 0 0 0 3.002 8c0 1.455.622 2.765 1.615 3.678L7.375 8zm.344 7.646.087.065z" />
                  </svg>

                  <span className="tooltip italic font-medium rounded-md text-xs shadow-lg p-1 px-2 bg-gray-100 ml-2">
                    Account Settings
                  </span>
                </Link>

                <div className="flex gap-2 items-center">
                  <div className="flex flex-col gap-0 leading-3">
                    <h1 className="uppercase font-semibold name text-xl">
                      {session?.user.full_name}
                    </h1>
                    <p className="role capitalize">{session?.user.role}</p>
                  </div>
                  <Image
                    className="rounded-full border object-cover select-none avatar"
                    src={avatarURI}
                    alt="user_avatar"
                    width={50}
                    height={50}
                  />
                </div>
              </header>

              <main className="mx-10 my-4">{children}</main>
            </div>
          </SessionProvider>
        </div>
      </div>
    </>
  );
};

export default Outline;
