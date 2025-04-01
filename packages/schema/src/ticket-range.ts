import { z } from 'zod'

export const ticketRangeCreateSchema = z
  .object({
    start: z.coerce.number().describe('Início'),
    end: z.coerce.number().optional().describe('Fim'),
  })
  .describe('Ingresso')

export const ticketRangeSchema = ticketRangeCreateSchema.merge(
  z.object({
    memberId: z.string().uuid().describe('Membro'),
  }),
)

export const ticketRangeUpdateSchema = ticketRangeSchema.merge(
  z.object({
    id: z.string().uuid(),
  }),
)
