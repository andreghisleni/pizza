import { prisma } from '@pizza/prisma'
import { ticketPaymentSchema } from '@pizza/schema'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const ticketPaymentsRouter = createTRPCRouter({
  createTicketPayment: protectedProcedure
    .input(ticketPaymentSchema)
    .mutation(async ({ input }) => {
      const ticketPayment = await prisma.ticketPayment.create({
        data: {
          visionId: input.visionId,
          amount: input.amount,
          type: input.type,
          payedAt: input.payedAt,
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

  getTotalTicketPayments: protectedProcedure.query(async () => {
    const [totalValuePayedTickets, totalValuePayedTicketsOnLastWeek] =
      await prisma.$transaction([
        prisma.ticketPayment.findMany(),
        prisma.ticketPayment.findMany({
          where: {
            payedAt: {
              gte: new Date(new Date().setDate(new Date().getDate() - 7)),
              lte: new Date(),
            },
          },
        }),
      ])

    const totalValue = totalValuePayedTickets.reduce(
      (acc, ticket) => acc + ticket.amount,
      0,
    )

    const totalValueOnLastWeek = totalValuePayedTicketsOnLastWeek.reduce(
      (acc, ticket) => acc + ticket.amount,
      0,
    )

    return {
      totalPayedTickets: Number((totalValue / 50).toFixed(0)),
      totalPayedTicketsOnLastWeek: Number(
        (totalValueOnLastWeek / 50).toFixed(0),
      ),
      totalValuePayedTickets: totalValue,
      totalValuePayedTicketsOnLastWeek: totalValueOnLastWeek,
    }
  }),
})
