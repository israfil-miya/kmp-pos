import type { Metadata } from 'next';
import '@/app/globals.css';
import { Toaster } from 'sonner';
import { Karla, Lato } from 'next/font/google';
import cn from '@/utility/cn';

// Initialize the fonts
const karla = Karla({ subsets: ['latin'], weight: ['400', '700'] });
const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] });

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
    <html lang="en">
      <body className={cn(karla.className, lato.className)}>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        {children}
        <Toaster pauseWhenPageIsHidden richColors position="top-right" />
      </body>
    </html>
  );
}
