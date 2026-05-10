"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

export const ReactQueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (

    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
);