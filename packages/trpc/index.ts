import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

import { membersRouter } from './routers/members'
import { sessionRouter } from './routers/session'
import { settingsRouter } from './routers/settings'
import { storageRouter } from './routers/storage'
import { ticketPaymentsRouter } from './routers/ticket-payments'
import { ticketRangesRouter } from './routers/ticket-ranges'
import { ticketsRouter } from './routers/tickets'
import { usersRouter } from './routers/users'
import { createCallerFactory, mergeRouters } from './trpc'

export const appRouter = mergeRouters(
  storageRouter,
  usersRouter,
  settingsRouter,
  sessionRouter,
  membersRouter,
  ticketsRouter,
  ticketRangesRouter,
  ticketPaymentsRouter,
)

export { createCallerFactory }

export type AppRouter = typeof appRouter
export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>
