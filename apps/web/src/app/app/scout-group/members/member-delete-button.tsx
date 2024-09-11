'use client'

import { Loader2 } from 'lucide-react'
import { useState } from 'react'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { trpc } from '@/lib/trpc/react'

export function MemberDeleteButton({
  id,
  refetch,
}: {
  id: string
  refetch: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const { isPending, mutate: deleteMember } = trpc.deleteMember.useMutation({
    onSuccess: () => {
      refetch()

      toast({
        title: 'Membro excluído com sucesso',
      })
      setIsOpen(false)
    },
    onError: (error) => {
      toast({
        title: 'Erro ao excluir membro',
        description: error.message,
      })
    },
  })

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          Excluir
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Tem certeza que vai querer excluir?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Lembrando que a exclusão é permanente e não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button
            onClick={() => {
              deleteMember(id)
            }}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Excluir'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
