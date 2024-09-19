import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useToast } from '@/components/ui/use-toast'
import { trpc } from '@/lib/trpc/react'
import { inputNumberMask } from '@/utils/inputMasks'

const confirmTicketFormSchema = z.object({
  number: z.string(),
})

export type ConfirmTicketFormType = z.infer<typeof confirmTicketFormSchema>

export function ConfirmTicketForm({ refetch }: { refetch: () => void }) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<ConfirmTicketFormType>({
    resolver: zodResolver(confirmTicketFormSchema),
    defaultValues: {
      number: '',
    },
  })

  const createTicket = trpc.createTicket.useMutation({
    onSuccess: () => {
      toast({
        title: 'Ingresso cadastrado com sucesso',
      })
      form.reset()
      setIsOpen(false)
      refetch()
    },
    onError: (error) => {
      console.log(error)
      toast({
        title: 'Erro ao cadastrar ingresso',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const onSubmit = async (values: ConfirmTicketFormType) => {
    try {
      await createTicket.mutateAsync({
        number: Number(values.number),
      })
    } catch (error) {
      toast({
        title: 'Erro ao cadastrar ingresso',
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    if (!isOpen) {
      form.reset()
    }
  }, [isOpen, form])

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Adicionar</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Cadastrar ingresso</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número do ingresso</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o número do ingresso"
                      {...field}
                      value={inputNumberMask(field.value || '')}
                      maxLength={6}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Confirmar</Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
