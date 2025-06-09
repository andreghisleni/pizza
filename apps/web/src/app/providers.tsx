'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider as JotaiProvider } from 'jotai'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { ReactNode, useState } from 'react'
import { ToastContainer } from 'react-toastify'

import { TooltipProvider } from '@/components/ui/tooltip'
import { trpcLinks } from '@/lib/trpc/client'
import { trpc, TRPCProvider } from '@/lib/trpc/react'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => {
    return new QueryClient()
  })

  const [trpcClient] = useState(() => {
    return trpc.createClient({
      links: trpcLinks,
    })
  })

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TRPCProvider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <JotaiProvider>
            <TooltipProvider>
              <SessionProvider>{children}</SessionProvider>
            </TooltipProvider>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </JotaiProvider>
        </QueryClientProvider>
      </TRPCProvider>
    </ThemeProvider>
  )
}
