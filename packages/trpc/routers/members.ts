import { prisma } from '@pizza/prisma'
import { memberSchema, memberUpdateSchema } from '@pizza/schema'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

export const membersRouter = createTRPCRouter({
  createMembers: protectedProcedure
    .input(
      z.object({
        data: z.array(memberSchema),
      }),
    )
    .mutation(async ({ input }) => {
      const sessionNames = Array.from(
        new Set(input.data.map((member) => member.sessionName)),
      )

      const sessions = await prisma.session.findMany({
        where: {
          name: {
            in: sessionNames,
          },
        },
      })

      console.log(sessions)

      if (sessions.length !== sessionNames.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Session not found',
        })
      }

      const members = await prisma.member.createMany({
        data: input.data.map(({ sessionName, ...d }) => ({
          ...d,
          visionId: d.visionId === 'undefined' ? null : d.visionId,
          name: d.name
            .toLowerCase()
            .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase()),
          cleanName: d.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, ''),
          sessionId: sessions.find((s) => s.name === sessionName)!.id,
        })),
        skipDuplicates: true,
      })

      return { members }
    }),

  updateMember: protectedProcedure
    .input(memberUpdateSchema)
    .mutation(async ({ input }) => {
      const findMember = await prisma.member.findFirst({
        where: {
          id: input.id,
        },
      })

      if (!findMember) {
        throw new Error('Member not found')
      }

      const member = await prisma.member.update({
        where: {
          id: input.id,
        },
        data: input,
      })

      return member
    }),

  getMember: protectedProcedure
    .input(memberUpdateSchema)
    .query(async ({ input }) => {
      const member = await prisma.member.findFirst({
        where: {
          id: input.id,
        },
      })

      return { member }
    }),

  getMembers: protectedProcedure.query(async () => {
    const members = await prisma.member.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        session: true,
      },
    })

    return { members }
  }),

  getMembersWithVisionIdsOrNames: protectedProcedure
    .input(
      z.object({
        visionIds: z.array(z.string()),
        names: z.array(z.string()),
      }),
    )
    .query(async ({ input }) => {
      const members = await prisma.member.findMany({
        where: {
          OR: [
            {
              visionId: {
                in: input.visionIds,
              },
            },
            {
              cleanName: {
                in: input.names.map((name) =>
                  name
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, ''),
                ),
              },
            },
          ],
        },
      })

      return { members }
    }),

  getMemberByRegister: publicProcedure
    .input(
      z.object({
        register: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const member = await prisma.member.findFirst({
        where: {
          register: input.register,
        },
        include: {
          tickets: {
            orderBy: {
              number: 'asc',
            },
          },
          session: true,
        },
      })

      return { member }
    }),

  getTotalMembers: protectedProcedure.query(async () => {
    const totalMembers = await prisma.member.count()

    return { totalMembers }
  }),
})
