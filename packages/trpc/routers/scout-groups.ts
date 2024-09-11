import { prisma } from '@cepe/prisma'
import { scoutGroupSchema, scoutGroupUpdateSchema } from '@cepe/schema'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const scoutGroupsRouter = createTRPCRouter({
  createScoutGroup: protectedProcedure
    .input(scoutGroupSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user.id

      if (!userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        })
      }

      const findScoutGroup = await prisma.scoutGroups.findFirst({
        where: {
          OR: [
            {
              name: input.name,
            },
            {
              numeral: input.numeral,
              state: input.state,
            },
          ],
        },
      })

      if (findScoutGroup) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'ScoutGroup already exists',
        })
      }

      const scoutGroup = await prisma.scoutGroups.create({
        data: {
          ...input,
          userId,
        },
      })

      return scoutGroup
    }),

  getScoutGroup: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ input }) => {
      const scoutGroup = await prisma.scoutGroups.findFirst({
        where: {
          id: input,
        },
        include: { responsible: true, user: true, members: true },
      })

      return { scoutGroup }
    }),
  getMyScoutGroup: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user.id

    if (!userId) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User not authenticated',
      })
    }

    const scoutGroup = await prisma.scoutGroups.findFirst({
      where: {
        userId,
      },
      include: {
        responsible: true,
        user: true,
        members: true,
      },
    })

    return { scoutGroup }
  }),

  getScoutGroups: protectedProcedure.query(async () => {
    const scoutGroups = await prisma.scoutGroups.findMany({
      orderBy: {
        name: 'asc',
      },
      include: { responsible: true, user: true },
    })

    return { scoutGroups }
  }),

  getTotalScoutGroups: protectedProcedure.query(async () => {
    const totalScoutGroups = await prisma.scoutGroups.count()

    return { totalScoutGroups }
  }),

  updateScoutGroup: protectedProcedure
    .input(scoutGroupUpdateSchema)
    .mutation(async ({ input }) => {
      const findScoutGroup = await prisma.scoutGroups.findFirst({
        where: {
          id: input.id,
        },
      })

      if (!findScoutGroup) {
        throw new Error('ScoutGroup not found')
      }

      if (input.name !== findScoutGroup.name) {
        const findScoutGroup = await prisma.scoutGroups.findFirst({
          where: {
            name: input.name,
          },
        })

        if (findScoutGroup) {
          throw new Error('ScoutGroup already exists')
        }
      }

      const scoutGroup = await prisma.scoutGroups.update({
        where: {
          id: input.id,
        },
        data: input,
      })

      return scoutGroup
    }),

  submitInscription: protectedProcedure
    .input(
      z.object({
        file_name: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { scoutGroupId } = ctx.session?.user

      if (!scoutGroupId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        })
      }

      const scoutGroup = await prisma.scoutGroups.findFirst({
        where: {
          id: scoutGroupId,
        },
      })

      if (!scoutGroup) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'ScoutGroup not found',
        })
      }

      const scoutGroupUpdated = await prisma.scoutGroups.update({
        where: {
          id: scoutGroup.id,
        },
        data: {
          receipt_file: input.file_name,
          submitedAt: new Date(),
        },
      })

      return scoutGroupUpdated
    }),

  confirmInscription: protectedProcedure
    .input(
      z.object({
        scoutGroupId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const scoutGroup = await prisma.scoutGroups.findFirst({
        where: {
          id: input.scoutGroupId,
        },
      })

      if (!scoutGroup) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'ScoutGroup not found',
        })
      }

      const scoutGroupUpdated = await prisma.scoutGroups.update({
        where: {
          id: scoutGroup.id,
        },
        data: {
          confirmedAt: new Date(),
        },
      })

      return scoutGroupUpdated
    }),

  confirmPayment: protectedProcedure
    .input(
      z.object({
        scoutGroupId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const scoutGroup = await prisma.scoutGroups.findFirst({
        where: {
          id: input.scoutGroupId,
        },
      })

      if (!scoutGroup) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'ScoutGroup not found',
        })
      }

      const scoutGroupUpdated = await prisma.scoutGroups.update({
        where: {
          id: scoutGroup.id,
        },
        data: {
          paymentConfirmedAt: new Date(),
        },
      })

      return scoutGroupUpdated
    }),
})
