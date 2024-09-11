import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

import { membersRouter } from './routers/members'
import { responsibleRouter } from './routers/responsibles'
import { scoutGroupsRouter } from './routers/scout-groups'
import { settingsRouter } from './routers/settings'
import { storageRouter } from './routers/storage'
import { usersRouter } from './routers/users'
import { createCallerFactory, mergeRouters } from './trpc'

export const appRouter = mergeRouters(
  storageRouter,
  usersRouter,
  settingsRouter,
  scoutGroupsRouter,
  responsibleRouter,
  membersRouter,
)

export { createCallerFactory }

export type AppRouter = typeof appRouter
export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>
