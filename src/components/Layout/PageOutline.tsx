import { auth } from '@/auth';
import LogoutAction from '@/components/Logout/LogoutAction';
import { sha256 } from '@/utility/encrypt';
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

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
      <Topbar avatarURI={avatarURI} />
      <Sidebar LogoutAction={LogoutAction} />
      <main className="p-6 sm:ml-52 mt-[4.5rem]">{children}</main>
    </>
  );
};

export default Outline;
