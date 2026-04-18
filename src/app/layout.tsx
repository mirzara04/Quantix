import type { Metadata } from 'next';
import { Manrope, Space_Grotesk } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

const bodyFont = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const displayFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Opportunity Radar — AI-Powered Student Opportunity Management',
  description: 'Extract, rank, and act on scholarships, internships, and fellowships with AI-powered evidence-backed scoring.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable} h-full`}>
      <body className="min-h-full text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
