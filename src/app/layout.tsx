import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { Karla, Lato } from 'next/font/google';
import cn from '@/utility/cn';

// Initialize the fonts
const karla = Karla({ subsets: ['latin'], weight: ['400', '700'] });
const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata: Metadata = {
  title: 'POS @ DEMO',
  description:
    'POS @ DEMO is a point of sale system that allows you to manage your business with ease.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <head>
        <link rel="stylesheet" href="https://unpkg.com/flowbite@1.4.5/dist/flowbite.min.css" />
      </head> */}
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          karla.className,
          lato.className,
        )}
      >
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <main>{children}</main>
        <Toaster pauseWhenPageIsHidden richColors position="top-right" />
        {/* <script src="https://unpkg.com/flowbite@2.3.0/dist/flowbite.js"></script> */}
      </body>
    </html>
  );
}
