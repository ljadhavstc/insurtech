/**
 * App Providers
 * 
 * Root providers for Theme, I18n, SafeArea, Navigation, Toast, and TanStack Query.
 * Wrap the entire app with these providers.
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@/components/Toast';
import '@/i18n'; // Initialize i18n

interface ProvidersProps {
  children: React.ReactNode;
}

// Create a QueryClient instance for TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

