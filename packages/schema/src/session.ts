import { z } from 'zod'

export const sessionSchema = z
  .object({
    name: z.string().describe('Nome'),
    type: z
      .enum(['LOBINHO', 'ESCOTEIRO', 'SENIOR', 'PIONEIRO', 'OUTRO'])
      .describe('Tipo'),
  })
  .describe('Sessão')

export const sessionUpdateSchema = sessionSchema.merge(
  z.object({
    id: z.string().uuid(),
  }),
)

export enum TypeSession {
  LOBINHO = 'LOBINHO',
  ESCOTEIRO = 'ESCOTEIRO',
  SENIOR = 'SENIOR',
  PIONEIRO = 'PIONEIRO',
  OUTRO = 'OUTRO',
}
