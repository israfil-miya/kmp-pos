const authorizedRoutes = [
  { href: '/', label: 'Dashboard', roles: ['administrator'] },
  { href: '/stores', label: 'Stores', roles: ['administrator'] },
  { href: '/users', label: 'Users', roles: ['administrator'] },
  {
    href: '/suppliers',
    label: 'Suppliers',
    roles: ['administrator', 'manager'],
  },
  {
    href: '/categories',
    label: 'Categories',
    roles: ['administrator', 'manager'],
  },
  { href: '/products', label: 'Products', roles: ['administrator', 'manager'] },
  { href: '/pos', label: 'POS', roles: ['cashier', 'manager'] },
  { href: '/invoices', label: 'Invoices', roles: [] },
  { href: '/creditors', label: 'Creditors', roles: [] },
  { href: '/barcode', label: 'Barcode', roles: ['administrator'] },
  { href: '/expenses', label: 'Expenses', roles: ['administrator', 'manager'] },
  { href: '/expired', label: 'Expired', roles: ['manager'] },
  { href: '/logout', label: 'Logout', roles: [] },
];

export default authorizedRoutes;
