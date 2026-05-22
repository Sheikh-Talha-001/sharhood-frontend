import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from 'react-error-boundary';
import { GlobalErrorFallback } from './components/GlobalError';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={GlobalErrorFallback}>
      <App />
      <Toaster position="bottom-center" toastOptions={{ duration: 4000, style: { borderRadius: '1rem', background: '#333', color: '#fff', fontSize: '14px', fontWeight: 'bold' } }} />
    </ErrorBoundary>
  </StrictMode>,
);

