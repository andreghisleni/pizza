import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { inputPhoneMask } from '@/utils/inputMasks'

const confirmFormWithoutTicketSchema = z.object({
  name: z.string(),
  phone: z.string(),
  description: z.string().optional(),
})

export type ConfirmFormWithoutTicket = z.infer<
  typeof confirmFormWithoutTicketSchema
>

export function ConfirmFormWithoutTicket({
  onSubmit,
}: {
  onSubmit: (data: ConfirmFormWithoutTicket) => void
}) {
  const form = useForm<ConfirmFormWithoutTicket>({
    resolver: zodResolver(confirmFormWithoutTicketSchema),
    defaultValues: {
      description: '',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input
                  placeholder="(00) 0 0000-0000"
                  {...field}
                  value={inputPhoneMask(field.value || '')}
                  maxLength={16}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Obervação/anotação</FormLabel>
              <FormControl>
                <Input placeholder="Obervação/anotação" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Confirmar</Button>
      </form>
    </Form>
  )
}
