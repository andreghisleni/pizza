'use client'

import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { trpc } from '@/lib/trpc/react'

export function ConfirmPaymentButton({
  scoutGroupId,
  refetch,
}: {
  scoutGroupId: string
  refetch: () => void
}) {
  const { toast } = useToast()
  const { mutate, isPending } = trpc.confirmPayment.useMutation({
    onSuccess: () => {
      toast({
        title: 'Pagamento confirmado',
      })
      refetch()
    },
    onError: (error) => {
      toast({
        title: 'Erro ao confirmar pagamento',
        variant: 'destructive',
        description: error.message,
      })
    },
  })

  return (
    <Button
      onClick={() =>
        mutate({
          scoutGroupId,
        })
      }
      variant="outline"
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        'Confirmar pagamento'
      )}
    </Button>
  )
}
