import { z } from 'zod'

export const memberBaseSchema = z
  .object({
    name: z.string().min(1).describe('Nome'),
    sex: z.string().min(1).describe('Sexo'),
    registerNumber: z.string().min(1).describe('Número de registro'),
    registerVerifier: z.string().min(1).describe('Dígito verificador'),
    phoneNumber: z.string().min(1).describe('Número de telefone'),
    haveInsigniaDaMadeira: z.coerce
      .boolean()
      .default(false)
      .describe('Possui Insígnia da madeira'),
  })
  .describe('Responsável do grupo escoteiro')

export const memberBaseUpdateSchema = memberBaseSchema.merge(
  z.object({
    id: z.string().uuid(),
  }),
)

export const memberWithOutAlimentationSchema = memberBaseSchema.merge(
  z.object({
    birthDate: z.string().describe('Data de nascimento'),
    healthRestrictions: z.string().describe('Restrições de saúde'),
    function: z
      .enum([
        'ESCOTISTA_LOBINHO',
        'ESCOTISTA_ESCOTEIRO',
        'ESCOTISTA_SENIOR',
        'ESCOTISTA_PIONEIRO',
        'DIRIGENTE',
        'PIONEIRO',
      ])
      .describe('Função'),
  }),
)

export const memberWithOutAlimentationUpdateSchema =
  memberWithOutAlimentationSchema.merge(
    z.object({
      id: z.string().uuid(),
    }),
  )

export const memberWithAlimentationSchema =
  memberWithOutAlimentationSchema.merge(
    z.object({
      alimentationRestrictions: z.string().describe('Restrições alimentares'),
    }),
  )

export const memberWithAlimentationUpdateSchema =
  memberWithAlimentationSchema.merge(
    z.object({
      id: z.string().uuid(),
    }),
  )

// export type Member = z.infer<typeof memberUpdateSchema>

export enum FunctionsMember {
  ESCOTISTA_LOBINHO = 'Escotista Lobinho',
  ESCOTISTA_ESCOTEIRO = 'Escotista Escoteiro',
  ESCOTISTA_SENIOR = 'Escotista Sênior',
  ESCOTISTA_PIONEIRO = 'Escotista Pioneiro',
  DIRIGENTE = 'Dirigente',
  PIONEIRO = 'Pioneiro (a)',
}
