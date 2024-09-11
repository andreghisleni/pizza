import { z } from 'zod'

export const responsibleSchema = z
  .object({
    name: z.string().min(1).describe('Nome do responsável'),
    email: z.string().email().describe('E-mail do responsável'),
    phone: z.string().min(1).describe('Telefone do responsável'),
  })
  .describe('Responsável do grupo escoteiro')

export const responsibleUpdateSchema = responsibleSchema.merge(
  z.object({
    id: z.string().uuid(),
  }),
)

export type Responsible = z.infer<typeof responsibleUpdateSchema>
