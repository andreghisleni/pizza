import { prisma } from '@pizza/prisma'
import { ticketRangeSchema, ticketRangeUpdateSchema } from '@pizza/schema'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const ticketRangesRouter = createTRPCRouter({
  createTicketRange: protectedProcedure
    .input(ticketRangeSchema)
    .mutation(async ({ input }) => {
      const numbers: number[] = []

      if (input.end) {
        if (input.start > input.end) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'O número inicial deve ser menor que o número final',
          })
        }

        if (
          !(
            (input.start > 0 && input.end <= 1000) ||
            (input.start >= 2000 && input.end <= 3000)
          )
        ) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              'Os números devem estar entre 1 e 1000 ou entre 2000 e 3000',
          })
        }

        for (let i = input.start; i <= input.end; i++) {
          numbers.push(i)
        }
      } else {
        if (
          !input.end &&
          !(
            (input.start > 0 && input.start <= 1000) ||
            (input.start > 2000 && input.start <= 3000)
          )
        ) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              'Os números devem estar entre 1 e 1000 ou entre 2000 e 3000',
          })
        }

        numbers.push(input.start)
      }

      const ticketsExistis = await prisma.ticket.findMany({
        where: {
          number: {
            in: numbers,
          },
        },
      })

      if (ticketsExistis && ticketsExistis.length > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: `Tickets already exists with numbers: ${ticketsExistis
            .map((t) => t.number)
            .join(', ')}`,
        })
      }

      // check if number already exists in ticketRange
      const ticketRangeExists = await prisma.ticketRange.findMany({
        where: {
          deletedAt: null,
          OR: numbers.flatMap((number) => [
            {
              start: {
                lte: number,
              },
              end: {
                gte: number,
              },
            },
            {
              start: {
                gte: number,
                lte: number,
              },
            },
            {
              end: {
                gte: number,
                lte: number,
              },
            },
          ]),
        },
      })

      console.log('ticketRangeExists', ticketRangeExists)

      if (ticketRangeExists && ticketRangeExists.length > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: `TicketRange already exists, this range is already used from other ticket ranges.`,
        })
      }

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

      const ticketRange = await prisma.ticketRange.create({
        data: {
          ...input,

          end: input.end || input.start,
        },
      })

      return ticketRange
    }),

  // updateTicketRange: protectedProcedure
  //   .input(ticketRangeUpdateSchema)
  //   .mutation(async ({ input }) => {
  //     const findTicketRange = await prisma.ticketRange.findFirst({
  //       where: {
  //         id: input.id,
  //       },
  //     })

  //     if (!findTicketRange) {
  //       throw new Error('TicketRange not found')
  //     }

  //     const ticketRange = await prisma.ticketRange.update({
  //       where: {
  //         id: input.id,
  //       },
  //       data: input,
  //     })

  //     return ticketRange
  //   }),

  getTicketRange: protectedProcedure
    .input(ticketRangeUpdateSchema)
    .query(async ({ input }) => {
      const ticketRange = await prisma.ticketRange.findFirst({
        where: {
          id: input.id,
        },
      })

      return { ticketRange }
    }),

  getTicketRanges: protectedProcedure.query(async () => {
    const ticketRanges = await prisma.ticketRange.findMany({
      orderBy: [
        {
          member: {
            name: 'asc',
          },
        },
        {
          start: 'asc',
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

    return { ticketRanges }
  }),

  // getTicketRangesWithCritica: protectedProcedure.query(async () => {
  //   const ticketRanges = await prisma.ticketRange.findMany({
  //     orderBy: [
  //       {
  //         member: {
  //           name: 'asc',
  //         },
  //       },
  //       {
  //         number: 'asc',
  //       },
  //     ],
  //     include: {
  //       member: true,
  //     },
  //     where: {
  //       returned: true,
  //     },
  //   })

  //   return { ticketRanges }
  // }),

  // confirmTicketRanges: protectedProcedure
  //   .input(z.array(z.string()))
  //   .mutation(async ({ input }) => {
  //     const ticketRange = await prisma.ticketRange.updateMany({
  //       where: {
  //         id: {
  //           in: input,
  //         },
  //       },
  //       data: {
  //         deliveredAt: new Date(),
  //       },
  //     })

  //     return ticketRange
  //   }),

  getTotalTicketRanges: protectedProcedure.query(async () => {
    const totalTicketRanges = await prisma.ticketRange.count({
      where: {
        deletedAt: null,
      },
    })

    return {
      totalTicketRanges,
    }
  }),

  getTotalTicketRangeToGenerate: protectedProcedure.query(async () => {
    const ticketRanges = await prisma.ticketRange.findMany({
      where: {
        generatedAt: null,
        deletedAt: null,
      },
    })

    const numbers: number[] = []
    ticketRanges.forEach((ticketRange) => {
      if (ticketRange.end) {
        for (let i = ticketRange.start; i <= ticketRange.end; i++) {
          numbers.push(i)
        }
      } else {
        numbers.push(ticketRange.start)
      }
    })

    return {
      totalTicketRangeToGenerate: ticketRanges.length,
      totalNumbersToGenerate: numbers.length,
    }
  }),

  deleteTicketRange: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const ticketRange = await prisma.ticketRange.findUnique({
        where: {
          id: input.id,
        },
      })

      if (!ticketRange) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'TicketRange not found',
        })
      }

      if (ticketRange.deletedAt) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'TicketRange already deleted',
        })
      }

      if (ticketRange.generatedAt) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'TicketRange already generated',
        })
      }

      await prisma.ticketRange.update({
        where: {
          id: input.id,
        },
        data: {
          deletedAt: new Date(),
        },
      })
    }),

  generateTicketsFromTicketRange: protectedProcedure.mutation(async () => {
    const ticketRanges = await prisma.ticketRange.findMany({
      where: {
        generatedAt: null,
        deletedAt: null,
      },
    })
    const numbers: {
      number: number
      memberId: string | null
      ticketRangeId: string
    }[] = []
    ticketRanges.forEach((ticketRange) => {
      if (ticketRange.end) {
        for (let i = ticketRange.start; i <= ticketRange.end; i++) {
          numbers.push({
            number: i,
            memberId: ticketRange.memberId,
            ticketRangeId: ticketRange.id,
          })
        }
      } else {
        numbers.push({
          number: ticketRange.start,
          memberId: ticketRange.memberId,
          ticketRangeId: ticketRange.id,
        })
      }
    })
    const tickets = await prisma.ticket.createMany({
      data: numbers,
      skipDuplicates: true,
    })

    await prisma.ticketRange.updateMany({
      where: {
        generatedAt: null,
        deletedAt: null,
      },
      data: {
        generatedAt: new Date(),
      },
    })

    return {
      tickets,
    }
  }),
})
