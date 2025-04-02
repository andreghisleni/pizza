'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ticketPaymentCreateSchema } from '@pizza/schema'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { MySelect } from '@/components/my-select'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useToast } from '@/components/ui/use-toast'
import { trpc } from '@/lib/trpc/react'
import { cn } from '@/lib/utils'

export function TicketPaymentForm({
  refetch,
  memberId,
}: {
  refetch: () => void
  memberId: string
}) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const form = useForm<z.infer<typeof ticketPaymentCreateSchema>>({
    resolver: zodResolver(ticketPaymentCreateSchema),
    defaultValues: {},
  })

  const createTicketPayment = trpc.createTicketPayment.useMutation({
    onSuccess: () => {
      form.reset()
      setIsOpen(false)
      refetch()

      toast({
        title: `Pagamento cadastrado com sucesso`,
      })
    },
    onError: (error) => {
      console.log(error) // eslint-disable-line no-console
      toast({
        title: `Erro ao cadastrar pagamento`,
        description: error.message,

        variant: 'destructive',
      })
    },
  })

  async function onSubmit(values: z.infer<typeof ticketPaymentCreateSchema>) {
    console.log('values', values)

    try {
      await createTicketPayment.mutateAsync({
        ...values,
        memberId,
      })

      console.log('values', values)
    } catch (error) { } // eslint-disable-line
  }

  useEffect(() => {
    if (!isOpen) {
      form.reset()
    }
  }, [isOpen, form])

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Pagamento</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Cadastrar pagamento</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* <pre>
              {JSON.stringify(Object.keys(ticketPaymentSchema.shape), null, 2)}
            </pre> */}

            <FormField
              control={form.control}
              name="visionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Vision</FormLabel>
                  <FormControl>
                    <Input placeholder="ID Vision" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input placeholder="Valor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de pagamento</FormLabel>
                  <FormControl>
                    <MySelect
                      placeholder="Selecione o tipo de pagamento"
                      {...field}
                      options={[
                        { label: 'Dinheiro', value: 'CASH' },
                        { label: 'PIX', value: 'PIX' },
                      ]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pago em</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                          disabled={field.disabled}
                        >
                          {field.value ? (
                            format(field.value, 'PPP', {
                              locale: ptBR,
                            })
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {form.formState.isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Cadastrar'
              )}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
