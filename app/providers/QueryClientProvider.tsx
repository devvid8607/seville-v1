"use client";
import React, { ReactNode } from "react";
import {
  QueryClient,
  QueryClientProvider as RQProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

interface QueryClientProviderProps {
  children: ReactNode;
}

const QueryClientProvider: React.FC<QueryClientProviderProps> = ({
  children,
}) => {
  return <RQProvider client={queryClient}>{children}</RQProvider>;
};

export default QueryClientProvider;
