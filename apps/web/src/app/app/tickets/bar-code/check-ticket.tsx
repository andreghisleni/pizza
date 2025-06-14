'use client'

import { RouterOutput } from '@pizza/trpc'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import { DataTable } from '@/components/data-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { trpc } from '@/lib/trpc/react'
import { cn } from '@/lib/utils'

import { columns } from './columns'
import { ErrorPopup } from './error-popup'

export function CheckTicket() {
  // const { toast } = useToast()

  const [data, setData] = useState<RouterOutput['confirmTicket']['ticket'][]>()
  const [error, setError] = useState<
    'Ticket not found' | 'Ticket already delivered' | string | null
  >(null)

  const confirmTicket = trpc.confirmTicket.useMutation({
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data.error)
        setError(
          data.error === 'Ticket already delivered'
            ? `Ticket already delivered--->>${JSON.stringify(data.ticket)}`
            : data.error,
        )
        return
      }

      toast.success('Ingresso confirmado com sucesso.')
      setError(null)
      setData((o) => [data.ticket, ...(o || [])])
    },
    onError: (error) => {
      console.log(error.message)
      if (error.message === 'Ticket not found') {
        toast.error('Ingresso não encontrado.')
        setError('Ticket not found')

        return
      }
      if (error.message === 'Ticket already delivered') {
        toast.error('Ingresso já foi entregue.')
        setError(`Ticket already delivered`)

        return
      }

      toast.error(error.message)
    },
  })

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  async function handleKeyDown(event) {
    if (event.key === 'Enter') {
      // console.log('Enter pressionado! Valor:', event.target.value);

      // await getSaleItemByShotId(event.target.value)
      if (!event.target.value) {
        toast.error('Por favor, digite o código do ingresso.')
        return
      }

      if (error) {
        return
      }
      confirmTicket.mutate({
        number: event.target.value,
      })
      event.target.value = ''; // eslint-disable-line
    }
    if (event.key === ' ') {
      handleCloseError()
      event.preventDefault() // Previne o comportamento padrão de rolagem da página
    }
    if (event.key === 'Escape') {
      handleCloseError()
    }
  }

  function handleCloseError() {
    if (inputRef.current) {
      inputRef.current.value = ''
      inputRef.current.focus()
    }
    setError(null)
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Código do ingresso</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            ref={inputRef}
            onKeyDown={handleKeyDown}
            className={cn(
              'focus-visible:outline-hidden flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[type=date]:block dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-800',
            )}
            placeholder="Digite o código do produto da venda"
          />
        </CardContent>
      </Card>
      {data && (
        <div className="mt-4 flex w-full justify-center">
          <Card className="w-[960px]">
            <CardHeader>
              <CardTitle>Últimos ingressos entregues</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={data.sort((a, b) => {
                  // Converte as strings de data para objetos Date para uma comparação correta
                  const dateA = new Date(a.deliveredAt as Date | string)
                  const dateB = new Date(b.deliveredAt as Date | string)
                  return dateB.getTime() - dateA.getTime() // Ordena do mais antigo para o mais recente
                })}
                initialColumnVisibility={{ cleanName: false }}
              />
            </CardContent>
          </Card>
          {/* <ShowJson data={data} /> */}
        </div>
      )}
      {/* Popup de erro */}
      <ErrorPopup error={error} onClose={handleCloseError} />
    </div>
  )
}
