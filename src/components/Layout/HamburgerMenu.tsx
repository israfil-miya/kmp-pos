'use client';
import cn from '@/utility/cn';
import React, { useState } from 'react';

interface HamburgerMenuProps {
  className?: string;
  isDrawerOpen: boolean;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  className,
  isDrawerOpen,
  setIsDrawerOpen,
}) => {
  return (
    <>
      <div
        className={cn('hamburger-menu', className)}
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
      >
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
      <style jsx>{`
        .hamburger-menu {
          display: none;
          cursor: pointer;
          z-index: 1000;
        }

        .line {
          width: 30px;
          height: 3px;
          background-color: #333;
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
