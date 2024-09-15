import { prisma } from '@pizza/prisma'
import { ticketSchema, ticketUpdateSchema } from '@pizza/schema'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const ticketsRouter = createTRPCRouter({
  createTickets: protectedProcedure
    .input(
      z.object({
        data: z.array(ticketSchema),
      }),
    )
    .mutation(async ({ input }) => {
      const tickets = await prisma.ticket.createMany({
        data: input.data,
        skipDuplicates: true,
      })

      return { tickets }
    }),

  updateTicket: protectedProcedure
    .input(ticketUpdateSchema)
    .mutation(async ({ input }) => {
      const findTicket = await prisma.ticket.findFirst({
        where: {
          id: input.id,
        },
      })

      if (!findTicket) {
        throw new Error('Ticket not found')
      }

      const ticket = await prisma.ticket.update({
        where: {
          id: input.id,
        },
        data: input,
      })

      return ticket
    }),

  getTicket: protectedProcedure
    .input(ticketUpdateSchema)
    .query(async ({ input }) => {
      const ticket = await prisma.ticket.findFirst({
        where: {
          id: input.id,
        },
      })

      return { ticket }
    }),

  getTickets: protectedProcedure.query(async () => {
    const tickets = await prisma.ticket.findMany({
      orderBy: [
        {
          member: {
            name: 'asc',
          },
        },
        {
          number: 'asc',
        },
      ],
      include: {
        member: true,
      },
    })

    return { tickets }
  }),

  confirmTickets: protectedProcedure
    .input(z.array(z.string()))
    .mutation(async ({ input }) => {
      const ticket = await prisma.ticket.updateMany({
        where: {
          id: {
            in: input,
          },
        },
        data: {
          deliveredAt: new Date(),
        },
      })

      return ticket
    }),

  confirmTicketsWithoutTicket: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        phone: z.string(),
        description: z.string().optional(),
        ticketIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ input }) => {
      const tickets = await prisma.ticket.updateMany({
        where: {
          id: {
            in: input.ticketIds,
          },
        },
        data: {
          deliveredAt: new Date(),
          name: input.name,
          phone: input.phone,
          description: input.description,
        },
      })

      return tickets
    }),

  getTotalTickets: protectedProcedure.query(async () => {
    const totalTickets = await prisma.ticket.count()
    const totalDeliveredTickets = await prisma.ticket.count({
      where: {
        deliveredAt: {
          not: null,
        },
      },
    })

    return { totalTickets, totalDeliveredTickets }
  }),
})
