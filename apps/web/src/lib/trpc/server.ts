import 'server-only'

import { Handlers } from '@highlight-run/node'
import { auth } from '@pizza/auth'
import { env } from '@pizza/env'
import { appRouter, createCallerFactory } from '@pizza/trpc'

export const serverClient = createCallerFactory(appRouter)(
  async () => {
    const session = await auth()

    return { session }
  },
  {
    onError: ({ error }) => {
      // ... your own error handling logic here
      console.log('error here', error)

      Handlers.trpcOnError(
        {
          error,
          req: {
            headers: undefined,
          },
        },
        {
          projectID: env.HIGHLIGHT_PROJECT_ID || '',
          serviceName: 'gincana-trpc-app',
          environment: env.NODE_ENV,
        },
      )
    },
  },
)
