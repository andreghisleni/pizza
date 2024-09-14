'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { RouterOutput } from '@pizza/trpc'
import { Loader2 } from 'lucide-react'
import { ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { nativeClient } from '@/lib/trpc/client'
import { inputNumberMask } from '@/utils/inputMasks'

import { columns } from './columns'

const findMemberFormSchema = z.object({
  register: z.string().min(4, 'Mínimo de 4 caracteres'),
})

type FindMemberForm = z.infer<typeof findMemberFormSchema>

function DataItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <div className="text-right font-semibold">{label}:</div>
      <p className="line-clamp-2">{children}</p>
    </>
  )
}

export function FindMemberTickets() {
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<FindMemberForm>({
    resolver: zodResolver(findMemberFormSchema),
    defaultValues: {
      register: '',
    },
  })

  const [data, setData] =
    useState<RouterOutput['getMemberByRegister']['member']>()
  const [error, setError] = useState<string>()

  const onSubmit = async (data: FindMemberForm) => {
    try {
      const result = await nativeClient.getMemberByRegister.query({
        register: data.register,
      })

      setData(result.member)
    } catch (error: any) { // eslint-disable-line
      setError(error.message)
    }
  }

  return (
    <div className="space-y-8">
      <Button onClick={() => setIsOpen(true)} disabled={isOpen}>
        Consulte os ingrenços
      </Button>

      {isOpen && (
        <div className="flex flex-col items-center space-y-6 px-4">
          <Card className="mx-4 max-w-sm">
            <CardHeader>
              <CardTitle>Consultar com o registro</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="max-w-sm space-y-8 "
                >
                  <FormField
                    control={form.control}
                    name="register"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registro sem digito verificador</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Registro"
                            {...field}
                            value={inputNumberMask(field.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    {form.formState.isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      'Buscar'
                    )}
                  </Button>
                </form>
              </Form>

              {form.formState.isSubmitting && <div>Carregando...</div>}
              {form.formState.isSubmitSuccessful && !data && (
                <>
                  <h2 className="text-xl font-bold">
                    Nenhum membro encontrado
                  </h2>
                  <h3 className="text-base">
                    Verifique se o registro está correto e sem o digito
                    verificador (Número após o hífen)
                  </h3>
                </>
              )}
            </CardContent>
          </Card>

          {data && (
            <>
              <Card className="mx-4 max-w-sm">
                <CardHeader>
                  <CardTitle>Informações do membro</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-[auto_1fr] gap-4">
                  <DataItem label="Nome">{data.name} </DataItem>
                  <DataItem label="Seção">{data.session.name} </DataItem>
                  <DataItem label="Registro">{data.register} </DataItem>
                </CardContent>
              </Card>
              {data.tickets.length === 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Nenhum ingresso encontrado</CardTitle>
                    <CardDescription>
                      Os ingressos podem estar vinculados ao irmão ou irmã
                    </CardDescription>
                  </CardHeader>
                </Card>
              )}
              <div className="w-screen px-4">
                {data.tickets.length > 0 && (
                  <Card className="mx-auto max-w-2xl">
                    <CardHeader>
                      <CardTitle>Tickets</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 text-left sm:px-4">
                      <DataTable
                        columns={columns}
                        data={data.tickets}
                        showVisibilityToggle={false}
                        ifJustFilterComponent
                      />
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
          {error && <div>{error}</div>}
        </div>
      )}
    </div>
  )
}
