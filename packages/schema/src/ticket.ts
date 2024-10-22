import { z } from 'zod'

export const ticketSchema = z
  .object({
    memberId: z.string().uuid().optional().describe('Membro'),
    number: z.coerce.number().int().describe('Número'),
    returned: z.boolean().optional().describe('Devolvido'),
  })
  .describe('Ingresso')

export const ticketUpdateSchema = ticketSchema.merge(
  z.object({
    id: z.string().uuid(),
  }),
)
