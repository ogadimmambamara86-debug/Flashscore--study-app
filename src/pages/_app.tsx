
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import ErrorBoundary from '../components/ErrorBoundary';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log error to console and potentially external service
        console.error('App Error:', error, errorInfo);
      }}
    >
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}
