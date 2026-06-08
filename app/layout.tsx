import './globals.css';
import type { Metadata } from 'next';
import { Cormorant_Garamond, Lato } from 'next/font/google';
import ScrollRestoration from '@/components/ScrollRestoration';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
});

export const metadata: Metadata = {
  title: 'Wedding Invitation',
  description: 'You are invited to celebrate this special day.',
  icons: { icon: '/icon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${lato.variable}`}>
        <ScrollRestoration />
        {children}
      </body>
    </html>
  );
}
