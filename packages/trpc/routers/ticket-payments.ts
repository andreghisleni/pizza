import { prisma } from '@pizza/prisma'
import {
  ticketPaymentCreateWithVisionMemberIdSchema,
  ticketPaymentSchema,
  ticketPaymentUpdateSchema,
} from '@pizza/schema'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

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

  createTicketPayments: protectedProcedure
    .input(
      z.object({
        payments: z
          .array(ticketPaymentCreateWithVisionMemberIdSchema)
          .describe('Lista de pagamentos de ingressos'),
      }),
    )
    .mutation(async ({ input }) => {
      const uniqueMemberVisionIds = [
        ...new Set(input.payments.map((p) => p.visionMemberId || '')),
      ]

      const members = await prisma.member.findMany({
        where: {
          visionId: {
            in: uniqueMemberVisionIds,
          },
        },
      })

      if (members.length !== uniqueMemberVisionIds.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Nem todos os membros foram encontrados',
        })
      }
      const paymentsData = input.payments.map((payment) => {
        const member = members.find(
          (m) => m.visionId === payment.visionMemberId,
        )

        if (!member) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `Membro com Vision ID ${payment.visionMemberId} não encontrado`,
          })
        }

        return {
          visionId: payment.visionId,
          amount: payment.amount,
          type: payment.type,
          payedAt: payment.payedAt,
          memberId: member.id,
        }
      })

      const ticketPayments = await prisma.ticketPayment.createMany({
        data: paymentsData,
        skipDuplicates: true, // Ignora pagamentos duplicados
      })
      if (ticketPayments.count === 0) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Nenhum pagamento foi criado',
        })
      }
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
      prisma.ticketPayment.findMany({
        where: {
          deletedAt: null,
        },
      }),
      prisma.ticketPayment.findMany({
        where: {
          deletedAt: null,
          payedAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7)),
            lte: new Date(),
          },
        },
      }),
      prisma.member.findMany({
        where: {
          // ticketPayments: {
          //   some: {
          //     deletedAt: null,
          //   },
          // },
          tickets: {
            some: {
              returned: false, // Considera apenas ingressos não retornados
            },
          },
        },
        include: {
          tickets: {
            select: {
              number: true, // Apenas o número do ingresso é necessário para a contagem
            },
            where: {
              returned: false, // Considera apenas ingressos não retornados
            },
          },
          ticketPayments: {
            select: {
              amount: true, // Apenas o valor do pagamento é necessário para a soma
            },
            where: {
              deletedAt: null,
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

    const processedMembers = membersWithPizzaAndPaymentData.map((member) => {
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
        isPaidOff,
        isAllConfirmedButNotYetFullyPaid:
          member.isAllConfirmedButNotYetFullyPaid, // Passa o campo para o objeto processado
        status: isPaidOff ? 'Quitado' : 'Devendo',
      }
    })

    const payedPerMember = processedMembers
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

    const possibleTotalTicketsData = processedMembers
      .filter(
        (m) =>
          m.isPaidOff || (!m.isPaidOff && m.isAllConfirmedButNotYetFullyPaid),
      )
      .reduce(
        (acc, member) => ({
          totalTickets: acc.totalTickets + member.totalPizzasOrdered,
          calabresa: acc.calabresa + member.calabresaPizzas,
          mista: acc.mista + member.mistaPizzas,
        }),
        {
          totalTickets: 0,
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
      possibleTotalTickets: possibleTotalTicketsData.totalTickets, // Novo campo adicionado
      totalPredictedCalabresa: possibleTotalTicketsData.calabresa, // Novo campo adicionado
      totalPredictedMista: possibleTotalTicketsData.mista, // Novo campo adicionado
    }
  }),

  deleteTicketPayment: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user.id
      if (!userId) throw new Error('User not authenticated')

      const ticketPayment = await prisma.ticketPayment.update({
        where: {
          id: input.id,
        },
        data: {
          deletedAt: new Date(),
          deletedBy: userId,
        },
      })

      return ticketPayment
    }),

  getTicketPayments: protectedProcedure.query(async () => {
    const ticketPayments = await prisma.ticketPayment.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        visionId: 'asc',
      },
      include: {
        member: {
          select: {
            id: true,
            name: true,
            visionId: true,
          },
        },
      },
    })

    return { ticketPayments }
  }),

  getTicketPaymentsByVisionId: protectedProcedure
    .input(z.object({ visionIds: z.array(z.string()) }))
    .query(async ({ input }) => {
      const ticketPayments = await prisma.ticketPayment.findMany({
        where: {
          visionId: {
            in: input.visionIds,
          },
          deletedAt: null,
        },
        orderBy: {
          visionId: 'asc',
        },
        include: {
          member: {
            select: {
              id: true,
              name: true,
              visionId: true,
            },
          },
        },
      })

      return { ticketPayments }
    }),
})
