'use client'

import { FunctionsMember, memberWithOutAlimentationSchema } from '@pizza/schema'
import { RouterOutput } from '@pizza/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { MySelect } from '@/components/my-select'
import { Row } from '@/components/Row'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { trpc } from '@/lib/trpc/react'
import { inputNumberMask, inputPhoneMask } from '@/utils/inputMasks'

type Member = RouterOutput['getMyMembers']['members'][0]

function convertDate(date?: Date | null) {
  return date?.toISOString().split('T')[0]
}

function enumToArray(enumObject) {
  return Object.entries(enumObject).map(([key, value]) => ({
    label: value,
    value: key,
  }))
}

export function MemberWithOutAlimentationForm({
  refetch,
  member,
}: {
  refetch: () => void
  member?: Member
}) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const form = useForm<z.infer<typeof memberWithOutAlimentationSchema>>({
    resolver: zodResolver(memberWithOutAlimentationSchema),
    defaultValues: {
      ...member,
      birthDate: convertDate(member?.birthDate) || '',
      healthRestrictions: member?.healthRestrictions || '',
      function: member?.function as any, // eslint-disable-line
    },
    values: member
      ? {
          ...member,
          birthDate: convertDate(member?.birthDate) || '',
          healthRestrictions: member?.healthRestrictions || '',
          function: member?.function as any, // eslint-disable-line
        }
      : undefined,
  })

  const createMember = trpc.createWithOutAlimentationMember.useMutation({
    onSuccess: () => {
      form.reset()
      setIsOpen(false)
      refetch()

      toast({
        title: `Membro atualizado com sucesso`,
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.log(error) // eslint-disable-line no-console
      toast({
        title: `Erro ao atualizar o membro`,
        description: error.response?.data as string,

        variant: 'destructive',
      })
    },
  })
  const updateMember = trpc.updateWithOutAlimentationMember.useMutation({
    onSuccess: () => {
      form.reset()
      setIsOpen(false)
      refetch()

      toast({
        title: `Membro atualizado com sucesso`,
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.log(error) // eslint-disable-line no-console
      toast({
        title: `Erro ao atualizar o membro`,
        description: error.response?.data as string,

        variant: 'destructive',
      })
    },
  })

  async function onSubmit(
    values: z.infer<typeof memberWithOutAlimentationSchema>,
  ) {
    console.log('values', values)
    try {
      if (member) {
        await updateMember.mutateAsync({
          ...values,
          id: member.id,
        })
      } else {
        await createMember.mutateAsync({
          ...values,
        })
      }
    } catch (error) {} // eslint-disable-line
  }

  useEffect(() => {
    if (!isOpen) {
      form.reset()
    }
  }, [isOpen, form])

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          {member ? 'Editar' : 'Cadastrar membro - sem alimentação'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {member ? 'Editar' : 'Cadastrar membro - sem alimentação'}
          </DialogTitle>
        </DialogHeader>
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
            <Row>
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de telefone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(00) 0 0000-0000"
                        maxLength={15}
                        {...field}
                        value={inputPhoneMask(field.value || '')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de nascimento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Row>

            <Row>
              <FormField
                control={form.control}
                name="registerNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>N° Registro UEB</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="000000"
                        {...field}
                        value={inputNumberMask(field.value || '')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="registerVerifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dígito verificador</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="00"
                        {...field}
                        value={inputNumberMask(field.value || '')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Row>

            <FormField
              control={form.control}
              name="sex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sexo</FormLabel>
                  <FormControl>
                    <MySelect
                      {...field}
                      options={[
                        { label: 'Masculino', value: 'M' },
                        { label: 'Feminino', value: 'F' },
                      ]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="function"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Função</FormLabel>
                  <FormControl>
                    <MySelect
                      {...field}
                      options={enumToArray(FunctionsMember)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="haveInsigniaDaMadeira"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Possui Insígnia da madeira</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="healthRestrictions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Restrições de saúde (limitações físicas para os trabalhos do
                    mutirão)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Restrições de saúde  (limitações físicas para os trabalhos do mutirão)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
      </DialogContent>
    </Dialog>
  )
}
