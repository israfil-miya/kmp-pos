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
import { usePathname } from 'next/navigation';
import React from 'react';
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
  };

  return (
    <ul className={cn('space-y-1 font-medium', props.className)}>
      {authorizedRoutes.map(renderNavItem)}
    </ul>
  );
};

export default Nav;
