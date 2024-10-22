import { z } from 'zod'

export const memberSchema = z
  .object({
    name: z.string().describe('Nome'),
    visionId: z.string().optional().describe('Vision'),
    register: z.string().optional().describe('Registro'),
    sessionName: z.string().describe('Seção'),
  })
  .describe('Sessão')

export const memberCreateSchema = memberSchema.merge(
  z.object({
    sessionId: z.string().uuid().describe('Seção'),
    sessionName: z.undefined(),
  }),
)

export const memberUpdateSchema = memberCreateSchema.merge(
  z.object({
    id: z.string().uuid(),
  }),
)
