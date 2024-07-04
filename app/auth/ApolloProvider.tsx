// app/ApolloProvider.js
"use client";

import { ApolloProvider as ApolloHooksProvider } from "@apollo/client";
import client from "../clientlib/apolloClient";
import { ReactNode } from "react";

interface ApolloProviderProps {
  children: ReactNode;
}

const ApolloProvider: React.FC<ApolloProviderProps> = ({ children }) => {
  return <ApolloHooksProvider client={client}>{children}</ApolloHooksProvider>;
};

export default ApolloProvider;
