import { prisma } from '@cepe/prisma'
import { responsibleSchema, responsibleUpdateSchema } from '@cepe/schema'
import { TRPCError } from '@trpc/server'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const responsibleRouter = createTRPCRouter({
  createResponsible: protectedProcedure
    .input(responsibleSchema)
    .mutation(async ({ input, ctx }) => {
      const { scoutGroupId } = ctx.session?.user

      if (!scoutGroupId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        })
      }

      const findResponsible = await prisma.responsible.findFirst({
        where: {
          scoutGroupId,
        },
      })

      if (findResponsible) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Responsible already exists',
        })
      }

      const responsible = await prisma.responsible.create({
        data: {
          ...input,
          scoutGroupId,
        },
      })

      return responsible
    }),

  updateResponsible: protectedProcedure
    .input(responsibleUpdateSchema)
    .mutation(async ({ input }) => {
      const findResponsible = await prisma.responsible.findFirst({
        where: {
          id: input.id,
        },
      })

      if (!findResponsible) {
        throw new Error('Responsible not found')
      }

      const responsible = await prisma.responsible.update({
        where: {
          id: input.id,
        },
        data: input,
      })

      return responsible
    }),
})
