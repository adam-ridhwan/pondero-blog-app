import './globals.css';

import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getPosts } from '@/actions/getPosts';
import { getUsersById } from '@/actions/getUsersById';
import AuthProvider from '@/provider/auth-provider';
import HydrateAtoms from '@/provider/hydrate-atoms';
import JotaiProvider from '@/provider/jotai-provider';
import QueryProvider from '@/provider/query-provider';
import ThemeProvider from '@/provider/theme-provider';

import Navbar from '@/components/navbar/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pondero',
  description: 'Blog site for Pondero',
  keywords: ['Next.js', 'React', 'Tailwind CSS', 'Server Components', 'Radix UI', 'Blog'],
  authors: [
    {
      name: 'Adam Ridhwan',
      url: 'https://github.com/adam-ridhwan',
    },
  ],
  creator: 'Adam Ridhwan',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * FETCH INITIAL POSTS AND AUTHORS
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  const initialPosts = await getPosts(5, undefined);
  if (!initialPosts) throw new Error('Failed to fetch initial posts');

  // Fetch initial authors
  const authorIds = initialPosts.map(post => post.authorId);
  const initialAuthors = await getUsersById(authorIds);

  if (!initialAuthors) throw new Error('Failed to fetch initial authors');
  if (!initialPosts && !initialAuthors) throw new Error('Failed to fetch initial posts and authors');

  // Remove duplicate authors
  const seenAuthors = new Set();
  const uniqueAuthors = initialAuthors.filter(author => {
    if (!seenAuthors.has(author._id)) {
      seenAuthors.add(author._id);
      return true;
    }
    return false;
  });

  return (
    <html lang='en'>
      <body className={`${inter.className} max-h-screen min-h-screen w-full max-w-[100vw]`}>
        <AuthProvider>
          <JotaiProvider>
            <QueryProvider>
              <ThemeProvider>
                <HydrateAtoms posts={initialPosts} authors={uniqueAuthors}>
                  <Navbar />
                  {children}
                </HydrateAtoms>
              </ThemeProvider>
            </QueryProvider>
          </JotaiProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
