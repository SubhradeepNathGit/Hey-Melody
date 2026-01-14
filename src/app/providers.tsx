'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import FrontendLayout from '../../layouts/FrontendLayout';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <FrontendLayout>
        {children}
      </FrontendLayout>
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'glass-toast',
          style: {
            background: "rgba(18, 18, 20, 0.75)",
            color: "#fff",
            backdropFilter: "blur(36px) saturate(180%)",
            WebkitBackdropFilter: "blur(16px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
            fontSize: "15px",
            fontWeight: "500",
            padding: "14px 24px",
            borderRadius: "16px",
            maxWidth: "400px",
            textAlign: "center"
          },
          success: {
            style: {
              border: "1px solid rgba(6, 182, 212, 0.4)",
              background: "rgba(6, 182, 212, 0.08)",
            },
            iconTheme: {
              primary: "#22d3ee",
              secondary: "#fff",
            },
          },
          error: {
            style: {
              border: "1px solid rgba(239, 68, 68, 0.4)",
              background: "rgba(239, 68, 68, 0.08)",
            },
            iconTheme: {
              primary: "#f87171",
              secondary: "#fff",
            },
          },
          duration: 3500,
        }}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
