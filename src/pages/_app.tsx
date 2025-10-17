import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrandingProvider } from '../contexts/BrandingContext';
import { AuthProvider } from '../contexts/AuthContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrandingProvider>
          <Component {...pageProps} />
        </BrandingProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}