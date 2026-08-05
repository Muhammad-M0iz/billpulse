import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { client } from './client/client.gen';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import App from './App.tsx';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

client.setConfig({
  baseUrl: apiBaseUrl,
});

// Interceptor to append Bearer token automatically to every outgoing API request
client.interceptors.request.use((request: any) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }
  return request;
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2, // 2 minutes
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
        <Toaster position="top-right" theme="dark" richColors />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
