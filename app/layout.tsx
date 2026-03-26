import Navbar from '@/components/Navbar';
import AIChatbot from '@/components/AIChatbot';
import Providers from '@/components/Providers';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'QIB — Quantum Intelligent Banking',
  description: 'Next-generation AI-powered banking platform with real-time payments, ESG analytics, and embedded finance.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Providers>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <AIChatbot />
        </Providers>
      </body>
    </html>
  );
}
