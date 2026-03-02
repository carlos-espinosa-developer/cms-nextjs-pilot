import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'CMS Next.js Pilot',
  description: 'Headless WordPress + Next.js Dynamic Builder',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="bg-white" suppressHydrationWarning>
      <body className="bg-white text-black antialiased">
        <Navbar
          logoUrl={process.env.NEXT_PUBLIC_LOGO_URL ?? '/media/logo.png'}
          logoAlt="Inicio"
        />
        {children}
      </body>
    </html>
  );
}

