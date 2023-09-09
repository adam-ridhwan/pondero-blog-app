import './globals.css';

import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ThemeContextProvider from '@/context/theme-context-provider';
import ThemeProvider from '@/provider/theme-provider';

import Footer from '@/components/footer';
import NavBar from '@/components/nav-bar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <body className={`${inter.className}`}>
        <ThemeContextProvider>
          <ThemeProvider>
            <main className='min-h-screen w-full max-w-[100vw] overflow-hidden'>
              <div className='container mx-auto'>
                <NavBar />
                {children}
                <Footer />
              </div>
            </main>
          </ThemeProvider>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
