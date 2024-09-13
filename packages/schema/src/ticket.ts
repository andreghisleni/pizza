import { z } from 'zod'

export const ticketSchema = z
  .object({
    memberId: z.string().uuid().optional(),
    number: z.number().int(),
  })
  .describe('Ingresso')

export const ticketUpdateSchema = ticketSchema.merge(
  z.object({
    id: z.string().uuid(),
  }),
)
