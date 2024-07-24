import type { Metadata } from 'next';
import '@/app/globals.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Khalek Molla Plaza - POS',
  description: 'Khalek Molla Plaza',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="bg-gray-50">
        <noscript>You need to enable JavaScript to run this app.</noscript>
        {children}
        <Toaster pauseWhenPageIsHidden richColors position="top-right" />
      </body>
    </html>
  );
}
