import React from 'react'
import ReactDOM from 'react-dom/client'
// import { App } from './app'
// import './styles/globals.css'
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// import { Toaster } from 'sonner'
// import { VaultProvider } from './providers/vault-provider'

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 1000 * 60 * 5, // 5 minutes
//       refetchOnWindowFocus: false,
//       retry: 1,
//       gcTime: 1000 * 60 * 60 * 24, // 24 hours
//     },
//   },
// })

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <QueryClientProvider client={queryClient}>
//       <Toaster position="top-right" />
//       <VaultProvider>
//         <App />
//       </VaultProvider>
//       <ReactQueryDevtools initialIsOpen={false} />
//     </QueryClientProvider>
//   </React.StrictMode>,
// ) 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div>Hello World</div>
  </React.StrictMode>,
)
