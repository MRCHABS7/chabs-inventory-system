import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrandingProvider } from '../contexts/BrandingContext';
import { AuthProvider } from '../contexts/AuthContext';
import ClientOnly from '../components/ClientOnly';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center"><div>Loading...</div></div>}>
      <AuthProvider>
        <ThemeProvider>
          <BrandingProvider>
            <Component {...pageProps} />
          </BrandingProvider>
        </ThemeProvider>
      </AuthProvider>
    </ClientOnly>
  );
}