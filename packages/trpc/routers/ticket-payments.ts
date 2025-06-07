import { prisma } from '@pizza/prisma'
import { ticketPaymentSchema, ticketPaymentUpdateSchema } from '@pizza/schema'

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

  updateTicketPayment: protectedProcedure
    .input(ticketPaymentUpdateSchema)
    .mutation(async ({ input }) => {
      const findTicketPayment = await prisma.ticketPayment.findFirst({
        where: {
          id: input.id,
        },
      })

      if (!findTicketPayment) {
        throw new Error('TicketPayment not found')
      }

      const ticketPayment = await prisma.ticketPayment.update({
        where: {
          id: input.id,
        },
        data: input,
      })

      return ticketPayment
    }),

  getTotalTicketPayments: protectedProcedure.query(async () => {
    const [
      totalValuePayedTickets,
      totalValuePayedTicketsOnLastWeek,
      membersWithPizzaAndPaymentData,
    ] = await prisma.$transaction([
      prisma.ticketPayment.findMany(),
      prisma.ticketPayment.findMany({
        where: {
          payedAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7)),
            lte: new Date(),
          },
        },
      }),
      prisma.member.findMany({
        where: {
          ticketPayments: {
            some: {}, // Garante que apenas membros com pagamentos sejam retornados
          },
        },
        include: {
          tickets: {
            select: {
              number: true, // Apenas o número do ingresso é necessário para a contagem
            },
          },
          ticketPayments: {
            select: {
              amount: true, // Apenas o valor do pagamento é necessário para a soma
            },
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

    const payedPerMember = membersWithPizzaAndPaymentData
      .map((member) => {
        // Use Array.prototype.reduce to count calabresa and mista pizzas
        const { calabresaCount, mistaCount } = member.tickets.reduce(
          (acc, ticket) => {
            if (ticket.number >= 0 && ticket.number <= 1000) {
              acc.calabresaCount++
            } else if (ticket.number >= 2000 && ticket.number <= 3000) {
              acc.mistaCount++
            }
            return acc
          },
          { calabresaCount: 0, mistaCount: 0 },
        )

        // Use Array.prototype.reduce to sum up all payments
        const totalPaymentsMade = member.ticketPayments.reduce(
          (sum, payment) => sum + payment.amount,
          0,
        )

        const totalPizzas = calabresaCount + mistaCount
        const totalPizzasCostExpected = totalPizzas * 50
        const isPaidOff = totalPaymentsMade >= totalPizzasCostExpected

        return {
          memberId: member.id,
          memberName: member.name,
          calabresaPizzas: calabresaCount,
          mistaPizzas: mistaCount,
          totalPizzasOrdered: totalPizzas,
          totalPaymentsMade,
          totalPizzasCostExpected,
          isPaidOff, // true if the member is paid off, false otherwise
          status: isPaidOff ? 'Quitado' : 'Devendo',
        }
      })
      .filter((m) => m.isPaidOff)
      .reduce(
        (acc, member) => ({
          calabresa: acc.calabresa + member.calabresaPizzas,
          mista: acc.mista + member.mistaPizzas,
        }),
        {
          calabresa: 0,
          mista: 0,
        },
      )

    return {
      totalPayedTickets: Number((totalValue / 50).toFixed(0)),
      totalPayedTicketsOnLastWeek: Number(
        (totalValueOnLastWeek / 50).toFixed(0),
      ),
      totalValuePayedTickets: totalValue,
      totalValuePayedTicketsOnLastWeek: totalValueOnLastWeek,
      totalCalabresaPayed: payedPerMember.calabresa,
      totalMistaPayed: payedPerMember.mista,
    }
  }),
})
