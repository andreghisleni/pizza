import { prisma } from '@pizza/prisma'
import {
  memberBaseSchema,
  memberBaseUpdateSchema,
  memberWithAlimentationSchema,
  memberWithAlimentationUpdateSchema,
  memberWithOutAlimentationSchema,
  memberWithOutAlimentationUpdateSchema,
} from '@pizza/schema'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '../trpc'

async function checkMember(
  scoutGroupId: string | null,
  registerNumber: string,
) {
  if (!scoutGroupId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'User not authenticated',
    })
  }

  const findMember = await prisma.members.findFirst({
    where: {
      registerNumber,
    },
  })

  if (findMember) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'Member already exists',
    })
  }

  return { scoutGroupId }
}

export const membersRouter = createTRPCRouter({
  createDonateMember: protectedProcedure
    .input(memberBaseSchema)
    .mutation(async ({ input, ctx }) => {
      const { scoutGroupId } = await checkMember(
        ctx.session.user.scoutGroupId,
        input.registerNumber,
      )

      const member = await prisma.members.create({
        data: {
          ...input,
          scoutGroupId,
          type: 'DONATION',
        },
      })

      return member
    }),

  updateDonateMember: protectedProcedure
    .input(memberBaseUpdateSchema)
    .mutation(async ({ input }) => {
      const findMember = await prisma.members.findFirst({
        where: {
          id: input.id,
        },
      })

      if (!findMember) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Member not found',
        })
      }

      const member = await prisma.members.update({
        where: {
          id: input.id,
        },
        data: input,
      })

      return member
    }),

  createWithOutAlimentationMember: protectedProcedure
    .input(memberWithOutAlimentationSchema)
    .mutation(async ({ input, ctx }) => {
      const { scoutGroupId } = await checkMember(
        ctx.session.user.scoutGroupId,
        input.registerNumber,
      )

      const member = await prisma.members.create({
        data: {
          ...input,
          birthDate: new Date(input.birthDate),
          scoutGroupId,
          type: 'WITHOUT_ALIMENTATION',
        },
      })

      return member
    }),

  updateWithOutAlimentationMember: protectedProcedure
    .input(memberWithOutAlimentationUpdateSchema)
    .mutation(async ({ input }) => {
      const findMember = await prisma.members.findFirst({
        where: {
          id: input.id,
        },
      })

      if (!findMember) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Member not found',
        })
      }

      const member = await prisma.members.update({
        where: {
          id: input.id,
        },
        data: { ...input, birthDate: new Date(input.birthDate) },
      })

      return member
    }),

  createWithAlimentationMember: protectedProcedure
    .input(memberWithAlimentationSchema)
    .mutation(async ({ input, ctx }) => {
      const { scoutGroupId } = await checkMember(
        ctx.session.user.scoutGroupId,
        input.registerNumber,
      )

      const member = await prisma.members.create({
        data: {
          ...input,
          birthDate: new Date(input.birthDate),
          scoutGroupId,
          type: 'WITH_ALIMENTATION',
        },
      })

      return member
    }),

  updateWithAlimentationMember: protectedProcedure
    .input(memberWithAlimentationUpdateSchema)
    .mutation(async ({ input }) => {
      const findMember = await prisma.members.findFirst({
        where: {
          id: input.id,
        },
      })

      if (!findMember) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Member not found',
        })
      }

      const member = await prisma.members.update({
        where: {
          id: input.id,
        },
        data: { ...input, birthDate: new Date(input.birthDate) },
      })

      return member
    }),

  getMyMembers: protectedProcedure.query(async ({ ctx }) => {
    const { scoutGroupId } = ctx.session.user

    if (!scoutGroupId) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User not authenticated',
      })
    }

    const members = await prisma.members.findMany({
      orderBy: {
        name: 'asc',
      },
      where: {
        scoutGroupId,
      },
    })

    return { members }
  }),

  getTotalMembers: protectedProcedure.query(async () => {
    const totalMembers = await prisma.members.count()

    return { totalMembers }
  }),

  deleteMember: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const findMember = await prisma.members.findFirst({
        where: {
          id: input,
        },
      })

      if (!findMember) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Member not found',
        })
      }

      await prisma.members.delete({
        where: {
          id: input,
        },
      })

      return true
    }),
})
