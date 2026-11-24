import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Chakra_Petch, Russo_One } from 'next/font/google';
import './globals.css';

const headingFont = Russo_One({
  variable: '--font-heading-source',
  subsets: ['latin'],
  weight: '400',
});

const bodyFont = Chakra_Petch({
  variable: '--font-sans-source',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Tic Tac Toe',
  description: 'A quick game of Tic Tac Toe for two players.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
