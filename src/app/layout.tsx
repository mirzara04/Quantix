import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Opportunity Radar — AI-Powered Student Opportunity Management',
  description: 'Extract, rank, and act on scholarships, internships, and fellowships with AI-powered evidence-backed scoring.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-[#050505] text-slate-200 antialiased">
        {children}
      </body>
    </html>
  );
}
