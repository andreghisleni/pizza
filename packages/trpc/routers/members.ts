import { prisma } from '@pizza/prisma'
import {
  memberCreateSchema,
  memberSchema,
  memberUpdateSchema,
} from '@pizza/schema'
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
        new Set(input.data.map((member) => member.sessionName.toLowerCase())),
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
        const missingSessions = sessionNames.filter(
          (sessionName) =>
            !sessions.find((session) => session.name === sessionName),
        )
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Sessions not found: ${missingSessions.join(', ')}`,
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
          sessionId: sessions.find((s) => s.name === sessionName.toLowerCase())!
            .id,
        })),
        skipDuplicates: true,
      })

      return { members }
    }),

  createMember: protectedProcedure
    .input(memberCreateSchema)
    .mutation(async ({ input }) => {
      const verifyMember = await prisma.member.findFirst({
        where: {
          OR: [
            {
              name: input.name,
            },
            {
              register: input.register,
            },
            {
              visionId: input.visionId,
            },
          ],
        },
      })

      if (verifyMember) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Member already exists',
        })
      }

      const member = await prisma.member.create({
        data: {
          ...input,
          visionId: input.visionId === 'undefined' ? null : input.visionId,
          name: input.name
            .toLowerCase()
            .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase()),
          cleanName: input.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, ''),
        },
      })

      return { member }
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
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const member = await prisma.member.findFirst({
        where: {
          id: input.id,
        },
        include: {
          session: true,
          tickets: {
            orderBy: {
              number: 'asc',
            },
          },
          ticketPayments: {
            orderBy: {
              createdAt: 'desc',
            },
            where: {
              deletedAt: null,
            },
          },
          ticketRanges: {
            orderBy: {
              start: 'asc',
            },
            where: {
              deletedAt: null,
            },
          },
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
        tickets: {
          orderBy: {
            number: 'asc',
          },
        },
        ticketPayments: {
          orderBy: {
            createdAt: 'desc',
          },
          where: {
            deletedAt: null,
          },
        },
        ticketRanges: {
          orderBy: {
            start: 'asc',
          },
          where: {
            deletedAt: null,
          },
        },
      },
    })

    return {
      members: members.map((member) => ({
        ...member,
        totalTickets: member.tickets.length,
        totalReturned: member.tickets.filter((ticket) => ticket.returned)
          .length,
        totalAmount: member.tickets.length * 50,
        totalPayed: member.ticketPayments.reduce(
          (acc, payment) => acc + payment.amount || 0,
          0,
        ),
        totalPayedWithCash: member.ticketPayments.reduce(
          (acc, payment) =>
            acc + (payment.type === 'CASH' ? payment.amount : 0),
          0,
        ),
        totalPayedWithPix: member.ticketPayments.reduce(
          (acc, payment) => acc + (payment.type === 'PIX' ? payment.amount : 0),
          0,
        ),
        total:
          member.ticketPayments.reduce(
            (acc, payment) => acc + payment.amount || 0,
            0,
          ) -
          member.tickets.filter((ticket) => !ticket.returned).length * 50, // Saldo
      })),
    }
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

  toggleIsAllConfirmedButNotYetFullyPaid: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const member = await prisma.member.findFirst({
        where: {
          id: input.id,
        },
      })

      if (!member) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Member not found',
        })
      }

      const updatedMember = await prisma.member.update({
        where: {
          id: input.id,
        },
        data: {
          isAllConfirmedButNotYetFullyPaid:
            !member.isAllConfirmedButNotYetFullyPaid,
        },
      })

      return { updatedMember }
    }),
})
