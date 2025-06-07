import { prisma } from '@pizza/prisma'
import { ticketSchema, ticketUpdateSchema } from '@pizza/schema'
import { TRPCError } from '@trpc/server'
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
  createTicket: protectedProcedure
    .input(ticketSchema)
    .mutation(async ({ input }) => {
      const ticketExistis = await prisma.ticket.findFirst({
        where: {
          number: input.number,
        },
      })

      if (ticketExistis) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Ticket already exists',
        })
      }

      if (input.memberId) {
        const member = await prisma.member.findFirst({
          where: {
            id: input.memberId,
          },
        })

        if (!member) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Member not found',
          })
        }
      }

      const ticket = await prisma.ticket.create({
        data: {
          ...input,
          created: input.memberId ? undefined : 'AFTERIMPORT',
        },
      })

      return ticket
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
        member: {
          include: {
            session: true,
          },
        },
      },
    })

    return { tickets }
  }),

  getTicketsWithCritica: protectedProcedure.query(async () => {
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
      where: {
        returned: true,
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
    // const totalTickets = await prisma.ticket.count()
    // const totalDeliveredTickets = await prisma.ticket.count({
    //   where: {
    //     deliveredAt: {
    //       not: null,
    //     },
    //   },
    // })
    // const totalTicketsAfterImport = await prisma.ticket.count({
    //   where: {
    //     created: 'AFTERIMPORT',
    //   },
    // })

    // const totalWithCritica = await prisma.ticket.count({
    //   where: {
    //     returned: true,
    //   },
    // })
    // const totalWithCriticaAndDelivered = await prisma.ticket.count({
    //   where: {
    //     returned: true,
    //     deliveredAt: {
    //       not: null,
    //     },
    //   },
    // })

    // const totalPayedTickets = await prisma.ticket.count({
    //   where: {
    //     ticketPaymentId: {
    //       not: null,
    //     },
    //   },
    // })

    // const totalPayedTicketsOnLastWeek = await prisma.ticket.count({
    //   where: {
    //     ticketPaymentId: {
    //       not: null,
    //     },
    //     ticketPayment: {
    //       payedAt: {
    //         gte: new Date(new Date().setDate(new Date().getDate() - 7)),
    //       },
    //     },
    //   },
    // })

    const [
      totalTickets,
      totalWithoutCritica,
      totalDeliveredTickets,
      totalTicketsAfterImport,
      totalWithCritica,
      totalWithCriticaAndDelivered,
      // totalPayedTickets,
      // totalPayedTicketsOnLastWeek,
      totalWithoutCriticaCalabresa,
      totalWithoutCriticaMista,
    ] = await prisma.$transaction([
      prisma.ticket.count(),
      prisma.ticket.count({
        where: {
          returned: false,
        },
      }),
      prisma.ticket.count({
        where: {
          deliveredAt: {
            not: null,
          },
        },
      }),
      prisma.ticket.count({
        where: {
          created: 'AFTERIMPORT',
        },
      }),
      prisma.ticket.count({
        where: {
          returned: true,
        },
      }),
      prisma.ticket.count({
        where: {
          returned: true,
          deliveredAt: {
            not: null,
          },
        },
      }),
      // prisma.ticket.count({
      //   where: {
      //     ticketPaymentId: {
      //       not: null,
      //     },
      //   },
      // }),
      // prisma.ticket.count({
      //   where: {
      //     ticketPaymentId: {
      //       not: null,
      //     },
      //     ticketPayment: {
      //       payedAt: {
      //         gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      //         lte: new Date(),
      //       },
      //     },
      //   },
      // }),

      prisma.ticket.count({
        where: {
          returned: false,
          number: {
            gte: 0,
            lte: 1000,
          },
        },
      }),
      prisma.ticket.count({
        where: {
          returned: false,
          number: {
            gte: 2000,
            lte: 3000,
          },
        },
      }),
    ])

    return {
      totalTickets,
      totalWithoutCritica,
      totalDeliveredTickets,
      totalTicketsAfterImport,
      totalWithCritica,
      totalWithCriticaAndDelivered,
      // totalPayedTickets,
      // totalPayedTicketsOnLastWeek,
      totalWithoutCriticaCalabresa,
      totalWithoutCriticaMista,
    }
  }),

  getTicketsAfterImport: protectedProcedure.query(async () => {
    const tickets = await prisma.ticket.findMany({
      where: {
        created: 'AFTERIMPORT',
      },
      orderBy: {
        number: 'asc',
      },
    })

    return { tickets }
  }),

  deleteTicket: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const ticket = await prisma.ticket.findUnique({
        where: {
          id: input.id,
        },
      })

      if (!ticket) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Ticket not found',
        })
      }

      if (ticket.deliveredAt) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Ticket already delivered',
        })
      }

      await prisma.ticket.delete({
        where: {
          id: input.id,
        },
      })
    }),

  returnTickets: protectedProcedure
    .input(
      z.object({
        ticketIds: z.array(z.string()),
        memberId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input }) => {
      const totalPayedTickets = await prisma.ticketPayment.findMany({
        where: {
          memberId: input.memberId,
        },
      })

      const totalTickets = await prisma.ticket.count({
        where: {
          memberId: input.memberId,
        },
      })

      if (totalPayedTickets.length > 0) {
        const totalPayedTicketsValue = totalPayedTickets.reduce(
          (acc, ticketPayment) => acc + ticketPayment.amount,
          0,
        )

        if (
          totalPayedTicketsValue >=
          (input.ticketIds.length + totalTickets) * 50
        ) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Member already paid for the tickets',
          })
        }
      }

      const tickets = await prisma.ticket.findMany({
        where: {
          id: {
            in: input.ticketIds,
          },
          memberId: input.memberId,
        },
      })

      if (input.ticketIds.length !== tickets.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Some tickets not found',
        })
      }

      const ticketsUpdated = await prisma.ticket.updateMany({
        where: {
          id: {
            in: input.ticketIds,
          },
          memberId: input.memberId,
        },
        data: {
          returned: true,
        },
      })

      return { tickets: ticketsUpdated }
    }),
})
