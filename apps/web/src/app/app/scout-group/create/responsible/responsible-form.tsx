'use client'

import { responsibleSchema } from '@pizza/schema'
import { RouterOutput } from '@pizza/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { useToast } from '@/components/ui/use-toast'
import { trpc } from '@/lib/trpc/react'

// import { Responsible } from './columns'

const formName = responsibleSchema.description

const values = {}

export type Responsible = RouterOutput['createResponsible']

export function ResponsibleForm({
  refetch,
  responsible,
  viewOnly = false,
}: {
  refetch?: (data: Responsible) => void
  responsible?: Responsible
  viewOnly?: boolean
}) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const form = useForm<z.infer<typeof responsibleSchema>>({
    resolver: zodResolver(responsibleSchema),
    defaultValues: responsible
      ? {
          ...responsible,
        }
      : undefined,
    disabled: viewOnly,
    values: responsible
      ? {
          ...responsible,
        }
      : undefined,
  })

  const createResponsible = trpc.createResponsible.useMutation({
    onSuccess: (data) => {
      form.reset()
      setIsOpen(false)
      refetch && refetch(data)

      toast({
        title: `${formName} cadastrado com sucesso`,
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.log(error) // eslint-disable-line no-console
      toast({
        title: `Erro ao cadastrar o ${formName}`,
        description: error.response?.data as string,

        variant: 'destructive',
      })
    },
  })

  const updateResponsible = trpc.updateResponsible.useMutation({
    onSuccess: (data) => {
      form.reset()
      setIsOpen(false)
      refetch && refetch(data)

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

  async function onSubmit(values: z.infer<typeof responsibleSchema>) {
    try {
      if (responsible) {
        await updateResponsible.mutateAsync({
          id: responsible.id,
          ...values,
        })
      } else {
        await createResponsible.mutateAsync(values)
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* <pre>
              {JSON.stringify(Object.keys(responsibleSchema.shape), null, 2)}
            </pre> */}

        {Object.keys(responsibleSchema.shape).map((fieldName) => {
          const fieldSchema = responsibleSchema.shape[fieldName]
          const label = fieldSchema._def.description // Obtém a descrição do campo

          if (fieldSchema._def.typeName === 'ZodEnum') {
            const v: { value: string; label: string }[] = values[fieldName]

            return (
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName as keyof typeof responsibleSchema.shape}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <ReactSelect
                        defaultValue={v.filter(
                          (value) => value.value === field.value,
                        )}
                        value={v.filter((value) => value.value === field.value)}
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
                name={fieldName as keyof typeof responsibleSchema.shape}
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
                  name={fieldName as keyof typeof responsibleSchema.shape}
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

        {!viewOnly && (
          <Button type="submit" className="w-full">
            {form.formState.isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : responsible ? (
              'Editar'
            ) : (
              'Cadastrar'
            )}
          </Button>
        )}
      </form>
    </Form>
  )
}
