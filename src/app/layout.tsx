import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/animations/PageTransition';

export const metadata: Metadata = {
  title: 'QA Engineer Portfolio',
  description: 'A comprehensive portfolio showcasing quality engineering expertise across test automation, API testing, AI-driven quality, chaos engineering, and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-brand-background text-brand-text font-body antialiased overflow-x-hidden">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 w-full max-w-full">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
