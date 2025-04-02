import { z } from 'zod'

export const ticketPaymentCreateSchema = z
  .object({
    visionId: z.string().optional().describe('Visão'),
    amount: z.coerce.number().describe('Valor Pago'),
    type: z.enum(['CASH', 'PIX']).describe('Tipo de Pagamento'),
    // ticketIds: z.array(z.string()).nonempty().describe('Ingressos'),
    payedAt: z.coerce.date().default(new Date()).describe('Data do Pagamento'),
  })
  .describe('Pagamento do Ingresso')

export const ticketPaymentSchema = ticketPaymentCreateSchema.merge(
  z.object({
    memberId: z.string().uuid().describe('ID do Membro'),
  }),
)

export const ticketPaymentUpdateSchema = ticketPaymentSchema.merge(
  z.object({
    id: z.string().uuid(),
  }),
)
