// Client-side component
'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

type DrawerContextType = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
};

interface ClientLayoutProps {
  children: ReactNode; // Explicitly typing `children`
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <DrawerContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </DrawerContext.Provider>
  );
}
