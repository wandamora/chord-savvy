import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/context/app-provider';
import AppLayout from '@/components/app-layout';
import { AuthProvider } from '@/context/auth-provider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'ChordSavvy',
  description: 'A guitar chord sheet library for musicians to find and learn songs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${spaceGrotesk.variable}`}>
      <head />
      <body className="font-body antialiased">
        <AuthProvider>
          <AppProvider>
            <AppLayout>{children}</AppLayout>
            <Toaster />
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
