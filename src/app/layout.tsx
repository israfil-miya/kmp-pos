import '@/app/globals.css';
import type { Metadata } from 'next';
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
      <body className="">
        <noscript>You need to enable JavaScript to run this app.</noscript>
        {children}
        <Toaster
          closeButton
          richColors
          position="top-right"
          pauseWhenPageIsHidden
        />
      </body>
    </html>
  );
}
