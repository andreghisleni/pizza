import { prisma } from '@pizza/prisma'
import { ticketPaymentSchema } from '@pizza/schema'
import { TRPCError } from '@trpc/server'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const ticketPaymentsRouter = createTRPCRouter({
  createTicketPayment: protectedProcedure
    .input(ticketPaymentSchema)
    .mutation(async ({ input }) => {
      const ticketsExistis = await prisma.ticket.findMany({
        where: {
          id: {
            in: input.ticketIds,
          },
        },
      })

      if (!ticketsExistis) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Ticket not found',
        })
      }

      const ticketsPayedExists = ticketsExistis.filter(
        (ticket) => ticket.ticketPaymentId !== null,
      )

      if (ticketsPayedExists.length > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: `Ticket ${ticketsPayedExists.map((ticket) => ticket.id).join(', ')} already payed`,
        })
      }

      const ticketPayment = await prisma.ticketPayment.create({
        data: {
          visionId: input.visionId,
          amount: input.amount,
          type: input.type,
          payedAt: input.payedAt,
          tickets: {
            connect: input.ticketIds.map((ticketId) => ({ id: ticketId })),
          },
          memberId: input.memberId,
        },
      })

      return ticketPayment
    }),

  // updateTicketPayment: protectedProcedure
  //   .input(ticketPaymentUpdateSchema)
  //   .mutation(async ({ input }) => {
  //     const findTicketPayment = await prisma.ticketPayment.findFirst({
  //       where: {
  //         id: input.id,
  //       },
  //     })

  //     if (!findTicketPayment) {
  //       throw new Error('TicketPayment not found')
  //     }

  //     const ticketPayment = await prisma.ticketPayment.update({
  //       where: {
  //         id: input.id,
  //       },
  //       data: input,
  //     })

  //     return ticketPayment
  //   }),
})
