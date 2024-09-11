import { z } from 'zod'

export const scoutGroupSchema = z
  .object({
    name: z.string().min(1).describe('Nome do Grupo Escoteiro'),
    numeral: z.string().min(1).describe('Numeral'),
    state: z.string().min(1).describe('Estado'),
    city: z.string().min(1).describe('Cidade'),
    districtName: z.string().optional().describe('Nome do Distrito'),
  })
  .describe('Grupo Escoteiro')

export const scoutGroupUpdateSchema = scoutGroupSchema.merge(
  z.object({
    id: z.string().uuid(),
  }),
)

export type ScoutGroup = z.infer<typeof scoutGroupUpdateSchema>
