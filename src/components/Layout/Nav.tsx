'use client';

import Link from '@/components/NextLink';
import cn from '@/utility/cn';
import {
  ChartBarStacked,
  Container,
  CreditCard,
  HandCoins,
  LayoutDashboard,
  LogOut,
  Package,
  ScanBarcode,
  ScrollText,
  ShieldAlert,
  ShoppingCart,
  Store,
  Users,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useTransition } from 'react';
import { toast } from 'sonner';
import authorizedRoutes from '../../routes';

interface NavProps {
  LogoutAction: () => Promise<void>;
  className?: string;
}

const Nav: React.FC<NavProps> = props => {
  const { data: session } = useSession();
  const userRole = session?.user.role;
  const pathName = usePathname();

  const isAuthorized = (route: (typeof authorizedRoutes)[0]) => {
    return route.roles.length === 0 || route.roles.includes(userRole as string);
  };

  const renderNavItem = (route: (typeof authorizedRoutes)[0]) => {
    if (!isAuthorized(route)) return null;

    const isActive = pathName === route.href;
    const commonClasses =
      'p-4 flex items-center hover:bg-gray-900 hover:border-l-4 hover:text-white';
    const activeClasses = 'bg-gray-900 border-l-4 border-green-400 text-white';

    if (route.href === '/logout') {
      return (
        <li key={route.href}>
          <p
            onClick={() => props.LogoutAction()}
            className={`${commonClasses} select-none hover:cursor-pointer`}
          >
            <span className="flex relative left-5">
              {getIcon(route.label)}
              {route.label}
            </span>
          </p>
        </li>
      );
    }

    return (
      <li key={route.href}>
        <Link
          href={route.href}
          className={cn(commonClasses, isActive && activeClasses)}
        >
          <span className="flex relative left-5">
            {getIcon(route.label)}
            {route.label}
          </span>
        </Link>
      </li>
    );
  };

  const getIcon = (label: string) => {
    console.log(label);
    // Add your SVG icons here based on the label
    // This is just a placeholder, you should replace it with actual icons
    switch (label) {
      case 'Dashboard':
        return <LayoutDashboard size={24} className="mr-2" />;
      case 'Stores':
        return <Store size={24} className="mr-2" />;
      case 'Users':
        return <Users size={24} className="mr-2" />;
      case 'Suppliers':
        return <Container size={24} className="mr-2" />;
      case 'Categories':
        return <ChartBarStacked size={24} className="mr-2" />;
      case 'Products':
        return <Package size={24} className="mr-2" />;
      case 'POS':
        return <ShoppingCart size={24} className="mr-2" />;
      case 'Invoices':
        return <ScrollText size={24} className="mr-2" />;
      case 'Creditors':
        return <CreditCard size={24} className="mr-2" />;
      case 'Barcode':
        return <ScanBarcode size={24} className="mr-2" />;
      case 'Expenses':
        return <HandCoins size={24} className="mr-2" />;
      case 'Expired':
        return <ShieldAlert size={24} className="mr-2" />;
      case 'Logout':
        return <LogOut size={24} className="mr-2" />;
      default:
        return null;
    }
    // return (
    //   <svg
    //     className="w-6 h-6 mr-2"
    //     xmlns="http://www.w3.org/2000/svg"
    //     width="16"
    //     height="16"
    //     fill="currentColor"
    //     viewBox="0 0 16 16"
    //   >
    //     <path d="M8 4a.5.5 0 0 1 .5.5V6a.5.5 0 0 1-1 0V4.5A.5.5 0 0 1 8 4M3.732 5.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707M2 10a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 10m9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5m.754-4.246a.39.39 0 0 0-.527-.02L7.547 9.31a.91.91 0 1 0 1.302 1.258l3.434-4.297a.39.39 0 0 0-.029-.518z" />
    //     <path
    //       fillRule="evenodd"
    //       d="M0 10a8 8 0 1 1 15.547 2.661c-.442 1.253-1.845 1.602-2.932 1.25C11.309 13.488 9.475 13 8 13c-1.474 0-3.31.488-4.615.911-1.087.352-2.49.003-2.932-1.25A8 8 0 0 1 0 10m8-7a7 7 0 0 0-6.603 9.329c.203.575.923.876 1.68.63C4.397 12.533 6.358 12 8 12s3.604.532 4.923.96c.757.245 1.477-.056 1.68-.631A7 7 0 0 0 8 3"
    //     />
    //   </svg>
    // );
  };

  return (
    <ul className={cn('space-y-1 font-medium', props.className)}>
      {authorizedRoutes.map(renderNavItem)}
    </ul>
  );
};

export default Nav;
