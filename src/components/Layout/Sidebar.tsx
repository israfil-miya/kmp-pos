'use client';
import 'flowbite';
import { initFlowbite } from 'flowbite';
import React, { useEffect } from 'react';
import Nav from './Nav';

interface SidebarProps {
  LogoutAction: () => Promise<void>;
}

const Sidebar: React.FC<SidebarProps> = ({ LogoutAction }) => {
  useEffect(() => {
    initFlowbite();
  }, []);

  return (
    <div
      id="logo-sidebar"
      className="fixed top-0 left-0 z-40 w-52 h-screen pt-20 transition-transform -translate-x-full bg-gray-800 border-r border-gray-600 sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full pb-4 overflow-y-auto bg-gray-800 text-white">
        <Nav LogoutAction={LogoutAction} />
      </div>
    </div>
  );
};

export default Sidebar;
