import { z } from 'zod'

export const registerFormSchema = z.object({
  name: z.string().min(1),
  userName: z.string().min(1, { message: 'Use admin' }),
  email: z.string().email(),
  password: z.string().min(1, { message: 'Use 123456' }),
  numeral: z.string().min(1),
  state: z.string().min(1),
})

export type RegisterFormSchema = z.infer<typeof registerFormSchema>
