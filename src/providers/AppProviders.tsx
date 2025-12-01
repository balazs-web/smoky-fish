"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "@/contexts/AuthContext";
import { BasketProvider } from "@/contexts/BasketContext";
import { GlobalBasket } from "@/components/basket/GlobalBasket";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BasketProvider>
          {children}
          <GlobalBasket />
          <ReactQueryDevtools initialIsOpen={false} />
        </BasketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
