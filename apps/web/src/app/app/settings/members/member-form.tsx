'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { memberSchema } from '@pizza/schema'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { ReactSelect } from '@/components/Select'
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

import { Member } from './columns'

const formName = memberSchema.description

const values = {
  type: [
    { value: 'LOBINHO', label: 'Lobinho' },
    { value: 'ESCOTEIRO', label: 'Escoteiro' },
    { value: 'SENIOR', label: 'Senior' },
    { value: 'PIONEIRO', label: 'Pioneiro' },
    { value: 'OUTRO', label: 'Outro' },
  ],
}

export function MemberForm({
  refetch,
  member,
}: {
  refetch: () => void
  member?: Member
}) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const form = useForm<z.infer<typeof memberSchema>>({
    resolver: zodResolver(memberSchema),
    defaultValues: member
      ? {
          ...(member as any), // eslint-disable-line @typescript-eslint/no-explicit-any
        }
      : undefined,
  })

  // const createMember = trpc.createMember.useMutation({
  //   onSuccess: () => {
  //     form.reset()
  //     setIsOpen(false)
  //     refetch()

  //     toast({
  //       title: `${formName} cadastrado com sucesso`,
  //     })
  //   },
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   onError: (error: any) => {
  //     console.log(error) // eslint-disable-line no-console
  //     toast({
  //       title: `Erro ao cadastrar o ${formName}`,
  //       description: error.response?.data as string,

  //       variant: 'destructive',
  //     })
  //   },
  // })

  const updateMember = trpc.updateMember.useMutation({
    onSuccess: () => {
      form.reset()
      setIsOpen(false)
      refetch()

      toast({
        title: `${formName} atualizado com sucesso`,
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.log(error) // eslint-disable-line no-console
      toast({
        title: `Erro ao atualizar o ${formName}`,
        description: error.response?.data as string,

        variant: 'destructive',
      })
    },
  })

  async function onSubmit(values: z.infer<typeof memberSchema>) {
    try {
      if (member) {
        await updateMember.mutateAsync({
          id: member.id,
          ...values,
          sessionId: '',
        })
      } else {
        // await createMember.mutateAsync(values)
      }

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
        <Button variant="outline">{member ? 'Editar' : 'Adicionar'}</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {member ? 'Editar' : 'Cadastrar'} {formName}
          </SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* <pre>
              {JSON.stringify(Object.keys(memberSchema.shape), null, 2)}
            </pre> */}

            {Object.keys(memberSchema.shape).map((fieldName) => {
              const fieldSchema = memberSchema.shape[fieldName]
              const label = fieldSchema._def.description // Obtém a descrição do campo

              if (fieldSchema._def.typeName === 'ZodEnum') {
                const v: { value: string; label: string }[] = values[fieldName]

                return (
                  <FormField
                    key={fieldName}
                    control={form.control}
                    name={fieldName as keyof typeof memberSchema.shape}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                          <ReactSelect
                            defaultValue={v.filter(
                              (value) => value.value === field.value,
                            )}
                            value={v.filter(
                              (value) => value.value === field.value,
                            )}
                            onChange={(value: any) => { // eslint-disable-line
                              field.onChange(value.value)
                            }}
                            options={v}
                            isDisabled={field.disabled}
                            closeMenuOnSelect
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              }

              if (
                fieldSchema._def.typeName === 'ZodNumber' ||
                fieldSchema._def.typeName === 'ZodString'
              ) {
                return (
                  <FormField
                    key={fieldName}
                    control={form.control}
                    name={fieldName as keyof typeof memberSchema.shape}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                          <Input placeholder={label} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              }

              if (fieldSchema._def.typeName === 'ZodOptional') {
                if (
                  fieldSchema._def.innerType._def.typeName === 'ZodNumber' ||
                  fieldSchema._def.innerType._def.typeName === 'ZodString'
                ) {
                  return (
                    <FormField
                      key={fieldName}
                      control={form.control}
                      name={fieldName as keyof typeof memberSchema.shape}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{label}</FormLabel>
                          <FormControl>
                            <Input placeholder={label} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )
                }
              }

              return null
            })}

            <Button type="submit" className="w-full">
              {form.formState.isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : member ? (
                'Editar'
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
