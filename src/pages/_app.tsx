import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BrandingProvider } from '../contexts/BrandingContext';
import NoSSR from '../components/NoSSR';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NoSSR>
      <ThemeProvider>
        <BrandingProvider>
          <Component {...pageProps} />
        </BrandingProvider>
      </ThemeProvider>
    </NoSSR>
  );
}