import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PDFpaglu',
  description: 'Merge, split, compress and convert PDFs easily.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
