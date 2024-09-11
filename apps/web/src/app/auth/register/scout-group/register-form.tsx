'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, LogIn } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { nativeClient } from '@/lib/trpc/client'

import { RegisterFormSchema, registerFormSchema } from './form-schema'

export function RegisterForm() {
  const { toast } = useToast()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      userName: '',
      password: '',
    },
  })

  async function handleRegister(data: RegisterFormSchema) {
    const { name, userName, password, email, numeral, state } = data

    try {
      const response = await nativeClient.createUserWithScoutGroup.mutate({
        name,
        userName,
        password,
        email,
        numeral,
        state,
      })

      console.log(response)

      if (response.id) {
        toast({
          title: 'Bem-vindo!',
          description: 'Usuário criado com sucesso',
        })
        router.push('/')
      }
    } catch (error: any) {      // eslint-disable-line
      toast({
        title: 'Erro na autenticação',
        description: error.meta.responseJSON[0].error.json.message,
        variant: 'destructive',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="numeral">Numeral do grupo escoteiro</Label>
        <Input
          id="numeral"
          type="text"
          placeholder="Numeral do seu grupo escoteiro"
          {...register('numeral')}
        />
        {errors.numeral && (
          <p className="text-sm font-medium text-red-500 dark:text-red-400">
            {errors.numeral.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="state">Estado</Label>
        <Input
          id="state"
          type="text"
          placeholder="Estado do seu grupo escoteiro"
          {...register('state')}
        />
        {errors.state && (
          <p className="text-sm font-medium text-red-500 dark:text-red-400">
            {errors.state.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          type="text"
          placeholder="Seu nome"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-sm font-medium text-red-500 dark:text-red-400">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="userName">Registro UEB (sem Dígito verificador)</Label>
        <Input
          id="userName"
          type="text"
          placeholder="000000"
          {...register('userName')}
        />
        {errors.userName && (
          <p className="text-sm font-medium text-red-500 dark:text-red-400">
            {errors.userName.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="text"
          placeholder="Seu email"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm font-medium text-red-500 dark:text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          placeholder="Sua senha"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-sm font-medium text-red-500 dark:text-red-400">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <LogIn className="mr-2 h-4 w-4" />
        )}
        Register
      </Button>
    </form>
  )
}
