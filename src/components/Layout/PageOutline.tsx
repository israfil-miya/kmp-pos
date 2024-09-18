import { auth } from '@/auth';
import LogoutAction from '@/components/Logout/LogoutAction';
import crypto from 'crypto';
import { ReactNode } from 'react';
import ClientLayout from './ClientLayout';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface OutlineProps {
  children: ReactNode;
}

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

const Outline: React.FC<OutlineProps> = async ({ children }) => {
  const session = await auth();
  const avatarURI =
    'https://gravatar.com/avatar/' +
    (await sha256(
      session?.user.email.trim().toLowerCase() || 'johndoe@pos.com',
    )) +
    '/?s=400&d=identicon&r=x';
  return (
    <ClientLayout>
      <div className="flex flex-col">
        <Topbar avatarURI={avatarURI} />
        <div className="flex flex-grow">
          <Sidebar LogoutAction={LogoutAction} />
          <main className="mx-10 my-10 w-full h-full">{children}</main>
        </div>
      </div>
    </ClientLayout>
  );
};

export default Outline;
