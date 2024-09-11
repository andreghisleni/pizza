import type { AppRouter } from '@cepe/trpc'
import { createTRPCReact } from '@trpc/react-query'

export const trpc = createTRPCReact<AppRouter>()

export const TRPCProvider = trpc.Provider
