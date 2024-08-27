import '@/app/globals.css';
import { auth } from '@/auth';
import PageOutline from '@/components/Layout/PageOutline';
import { SessionProvider } from 'next-auth/react';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <PageOutline>{children}</PageOutline>
    </SessionProvider>
  );
}
