import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrandingProvider } from '../contexts/BrandingContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <BrandingProvider>
        <Component {...pageProps} />
      </BrandingProvider>
    </ThemeProvider>
  );
}