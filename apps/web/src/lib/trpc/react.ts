import type { AppRouter } from '@pizza/trpc'
import { createTRPCReact } from '@trpc/react-query'

export const trpc = createTRPCReact<AppRouter>()

export const TRPCProvider = trpc.Provider
