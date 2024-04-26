import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

type StoreProviderProps = {
	children?: React.ReactNode
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
	const queryClient = new QueryClient()
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
{
}
