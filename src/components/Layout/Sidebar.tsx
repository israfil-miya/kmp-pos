'use client';
import React from 'react';
import Nav from './Nav';
interface SidebarProps {
  LogoutAction: () => Promise<void>;
}
const Sidebar: React.FC<SidebarProps> = ({ LogoutAction }) => {
  return (
    <div className="sidebar bg-gray-800 w-56  h-[calc(100vh-72px)] overflow-auto text-white gap-6 pb-2 flex-col flex shadow-[4px_0px_10px_rgba(0,0,0,0.06)]">
      <Nav LogoutAction={LogoutAction} />
    </div>
  );
};

export default Sidebar;
