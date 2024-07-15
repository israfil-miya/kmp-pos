import Link from 'next/link';
import Image from 'next/image';
import { ReactNode } from 'react';
import LogoutAction from '@/components/Logout/LogoutAction';
import Nav from './Nav';
import { auth } from '@/auth';

interface OutlineProps {
  children: ReactNode;
}

const Outline: React.FC<OutlineProps> = async ({ children }) => {
  const session = await auth();
  return (
    <>
      <div className="flex flex-col h-screen">
        <div className="flex flex-grow">
          <aside className="bg-gray-800 w-56 text-white gap-6 pt-6 pb-2 flex-col flex shadow-[rgba(0,0,0,0.15)_0px_4px_10px] overflow-y-auto">
            <div className="flex flex-col gap-2 mb-4 mt-2 items-center text-nowrap">
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
            <header className="w-full px-10 py-4 flex flex-row justify-between items-center">
              <div className="flex gap-2 items-center p-4 bg-yellow-400 bg-opacity-30 text-xl font-semibold rounded-md">
                POS (Point of Sales) - v1.0
              </div>

              <div className="flex gap-2 items-center">
                <div className="flex flex-col gap-0 leading-4">
                  <h1 className="uppercase font-semibold name text-xl">
                    {session?.user.full_name}
                  </h1>
                  <p className="role capitalize">{session?.user.role}</p>
                </div>
                <Image
                  className="rounded-full border object-cover cursor-pointer avatar"
                  src={
                    'https://robohash.org/' + session?.user.email + '/?set=set4'
                  }
                  alt="user_avatar"
                  width={55}
                  height={55}
                />
              </div>
            </header>

            <main className="mx-10 my-4">{children}</main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Outline;
