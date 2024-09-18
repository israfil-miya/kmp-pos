import LogoutAction from '@/components/Logout/LogoutAction';
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface OutlineProps {
  children: ReactNode;
}

const Outline: React.FC<OutlineProps> = ({ children }) => {
  return (
    <>
      <div className="flex flex-col">
        <Topbar />
        <div className="flex flex-grow">
          <Sidebar LogoutAction={LogoutAction} />
          <main className="mx-10 my-10 w-full h-full">{children}</main>
        </div>
      </div>
    </>
  );
};

export default Outline;
