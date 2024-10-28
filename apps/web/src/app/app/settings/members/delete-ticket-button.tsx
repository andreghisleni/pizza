'use client'

import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { trpc } from '@/lib/trpc/react'

type IProps = {
  id: string
  refetch: () => void
  isDelivered: boolean
}

export function DeleteTicketButton({ id, refetch, isDelivered }: IProps) {
  const { toast } = useToast()
  const { mutateAsync: deleteTicket, isPending: isPendingTicket } =
    trpc.deleteTicket.useMutation({
      onSuccess: () => {
        toast({
          title: 'Sucesso',
          description: 'Usuário atualizado com sucesso',
        })
        refetch()
      },
      onError: (error) => {
        toast({
          title: 'Erro',
          description: error.message,
          variant: 'destructive',
        })
      },
    })

  async function handleDeleteTicket() {
    await deleteTicket({
      id,
    })
  }

  return (
    <Button
      disabled={isDelivered || isPendingTicket}
      onClick={handleDeleteTicket}
    >
      {isPendingTicket ? <Loader2 className="animate-spin" /> : 'Excluir'}
    </Button>
  )
}
