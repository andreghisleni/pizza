'use client'

import { scoutGroupSchema } from '@pizza/schema'
import { RouterOutput } from '@pizza/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
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

// import { ScoutGroup } from './columns'

const formName = scoutGroupSchema.description

const values = {}

export type ScoutGroup = RouterOutput['createScoutGroup']

export function ScoutGroupForm({
  refetch,
  scoutGroup,
  viewOnly = false,
}: {
  refetch?: (data: ScoutGroup) => void
  scoutGroup?: ScoutGroup
  viewOnly?: boolean
}) {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof scoutGroupSchema>>({
    resolver: zodResolver(scoutGroupSchema),
    defaultValues: scoutGroup
      ? { ...scoutGroup, districtName: scoutGroup.districtName || '' }
      : undefined,
    disabled: viewOnly,
    values: scoutGroup
      ? { ...scoutGroup, districtName: scoutGroup.districtName || '' }
      : undefined,
  })

  const createScoutGroup = trpc.createScoutGroup.useMutation({
    onSuccess: (data) => {
      form.reset()
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

  const updateScoutGroup = trpc.updateScoutGroup.useMutation({
    onSuccess: (data) => {
      form.reset()
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

  async function onSubmit(values: z.infer<typeof scoutGroupSchema>) {
    try {
      if (scoutGroup) {
        await updateScoutGroup.mutateAsync({
          id: scoutGroup.id,
          ...values,
        })
      } else {
        await createScoutGroup.mutateAsync(values)
      }

      console.log('values', values)
    } catch (error) { } // eslint-disable-line
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* <pre>
              {JSON.stringify(Object.keys(scoutGroupSchema.shape), null, 2)}
            </pre> */}

        {Object.keys(scoutGroupSchema.shape).map((fieldName) => {
          const fieldSchema = scoutGroupSchema.shape[fieldName]
          const label = fieldSchema._def.description // Obtém a descrição do campo

          if (fieldSchema._def.typeName === 'ZodEnum') {
            const v: { value: string; label: string }[] = values[fieldName]

            return (
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName as keyof typeof scoutGroupSchema.shape}
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
                name={fieldName as keyof typeof scoutGroupSchema.shape}
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
                  name={fieldName as keyof typeof scoutGroupSchema.shape}
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
            ) : scoutGroup ? (
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
