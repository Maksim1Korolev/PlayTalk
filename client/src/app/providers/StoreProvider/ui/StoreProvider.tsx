import React from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";

type StoreProviderProps = {
  children?: React.ReactNode;
};

//TODO:Replace
export const StoreProvider = ({ children }: StoreProviderProps) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
