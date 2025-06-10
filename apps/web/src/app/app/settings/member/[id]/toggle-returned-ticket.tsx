import { toast } from 'react-toastify'

import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc/react'

export function ToggleReturnedTicketButton({
  ticketId,
  refetch,
  isReturnedTicket,
}: {
  ticketId: string
  refetch: () => void
  isReturnedTicket: boolean
}) {
  const toggleReturnedTicket = trpc.toggleReturnedTicket.useMutation({
    onSuccess: () => {
      toast.success('Ticket atualizado com sucesso')
      refetch()
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar status do ticket: ${error.message}`)
    },
  })

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={() => toggleReturnedTicket.mutate({ id: ticketId })}
      disabled={toggleReturnedTicket.isPending}
    >
      {isReturnedTicket ? 'Não retornar' : 'Retornar'}
    </Button>
  )
}
