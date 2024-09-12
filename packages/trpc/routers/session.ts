import { prisma } from '@pizza/prisma'
import { sessionSchema, sessionUpdateSchema } from '@pizza/schema'
import { TRPCError } from '@trpc/server'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const sessionRouter = createTRPCRouter({
  createSession: protectedProcedure
    .input(sessionSchema)
    .mutation(async ({ input }) => {
      const findSession = await prisma.session.findUnique({
        where: {
          name: input.name,
        },
      })

      if (findSession) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Session already exists',
        })
      }

      const session = await prisma.session.create({
        data: {
          ...input,
        },
      })

      return session
    }),

  updateSession: protectedProcedure
    .input(sessionUpdateSchema)
    .mutation(async ({ input }) => {
      const findSession = await prisma.session.findFirst({
        where: {
          id: input.id,
        },
      })

      if (!findSession) {
        throw new Error('Session not found')
      }

      const session = await prisma.session.update({
        where: {
          id: input.id,
        },
        data: input,
      })

      return session
    }),

  getSession: protectedProcedure
    .input(sessionUpdateSchema)
    .query(async ({ input }) => {
      const session = await prisma.session.findFirst({
        where: {
          id: input.id,
        },
      })

      return { session }
    }),

  getSessions: protectedProcedure.query(async () => {
    const sessions = await prisma.session.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return { sessions }
  }),
})
