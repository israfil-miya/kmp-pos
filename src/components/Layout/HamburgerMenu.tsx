'use client';
import cn from '@/utility/cn';
import React, { useState } from 'react';
import { useDrawer } from './ClientLayout';

interface HamburgerMenuProps {
  className?: string;
}
const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ className }) => {
  const { toggleSidebar } = useDrawer();

  return (
    <>
      <div
        className={cn('hamburger-menu', className)}
        onClick={toggleSidebar}
        aria-label="Open Sidebar"
      >
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
      <style jsx>{`
        .hamburger-menu {
          display: none;
          cursor: pointer;
        }

        .line {
          width: 30px;
          height: 3px;
          background-color: #fff;
          margin: 5px;
          border-radius: 5px;
        }

        @media (max-width: 768px) {
          .hamburger-menu {
            display: block;
          }
        }
      `}</style>
    </>
  );
};

export default HamburgerMenu;
