import type { Metadata } from 'next';
import { TRPCProvider } from './_trpc/Provider';
import { ToastProvider } from '~/ui/components';
import { AuthProvider } from '~/app/store/AuthProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Template Embajadores - Lycsa Suite',
  description: 'Template fullstack para desarrollo de aplicaciones',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <TRPCProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </TRPCProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
