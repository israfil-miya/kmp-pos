import '@/app/globals.css';
import PageOutline from '@/components/Layout/PageOutline';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PageOutline>{children}</PageOutline>;
}
