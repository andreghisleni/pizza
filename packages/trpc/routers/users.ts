import { prisma } from '@pizza/prisma'
import { hash } from 'bcryptjs'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

export const usersRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: input.email,
        },
      })

      if (existingUser) {
        throw new Error('User already exists')
      }

      const hashedPassword = await hash(input.password, 10)

      const user = await prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          passwordHash: hashedPassword,
        },
      })

      return user
    }),

  getUser: protectedProcedure.query(async ({ input }) => {
    const user = await prisma.user.findFirst({
      where: {
        id: input,
      },
    })

    return user
  }),

  getUsers: protectedProcedure.query(async () => {
    const users = await prisma.user.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return { users }
  }),

  updatePassword: protectedProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
        password: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const hashedPassword = await hash(input.password, 10)

      const user = await prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          passwordHash: hashedPassword,
        },
      })

      return user
    }),

  // createUserWithActivity: protectedProcedure
  //   .input(
  //     z.object({
  //       activityId: z.string().uuid(),
  //     }),
  //   )
  //   .mutation(async ({ input }) => {
  //     const activity = await prisma.activity.findUnique({
  //       where: {
  //         id: input.activityId,
  //       },
  //     })

  //     if (!activity) {
  //       throw new Error('Activity not found')
  //     }

  //     // create a random password with 5 characters
  //     const password = Math.random().toString(36).slice(-5)

  //     // create userName from 5 random characters from the activity title
  //     const userName = activity.title
  //       .toLowerCase()
  //       .replaceAll(' ', '')
  //       .normalize('NFD')
  //       .split('')
  //       .sort(() => 0.5 - Math.random())
  //       .slice(0, 5)
  //       .join('')
  //       .toLowerCase()

  //     const hashedPassword = await hash(password, 10)

  //     const user = await prisma.user.create({
  //       data: {
  //         name: activity.title,
  //         userName,
  //         passwordHash: hashedPassword,
  //         activityId: input.activityId,
  //         password,
  //         type: 'ACTIVITY',
  //       },
  //     })

  //     return user
  //   }),

  updateUserActive: protectedProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.id === input.userId) {
        throw new Error('You cannot deactivate yourself')
      }

      const user = await prisma.user.findUnique({
        where: {
          id: input.userId,
        },
      })

      if (!user) {
        throw new Error('User not found')
      }

      const updatedUser = await prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          isActive: !user.isActive,
        },
      })

      return updatedUser
    }),

  updateUserType: protectedProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
        type: z.enum(['ADMIN', 'DEFAULT']),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.id === input.userId) {
        throw new Error('You cannot change your own type')
      }

      const user = await prisma.user.findUnique({
        where: {
          id: input.userId,
        },
      })

      if (!user) {
        throw new Error('User not found')
      }

      const updatedUser = await prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          type: input.type,
        },
      })

      return updatedUser
    }),

  getTotalUsers: protectedProcedure.query(async () => {
    const totalUsers = await prisma.user.count()

    return { totalUsers }
  }),
})
