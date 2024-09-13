import { Table } from '@tanstack/react-table'
import { MoreVertical } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import { trpc } from '@/lib/trpc/react'

import { Ticket } from './columns'
import { ConfirmFormWithoutTicket } from './confirm-form-without-ticket'

export function ticketActions({ refetch }: { refetch: () => void }) {
  return function Actions({ table }: { table: Table<Ticket> }) {
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
    const [openConfirmWithoutTicketDialog, setOpenConfirmWithoutTicketDialog] =
      useState(false)

    const { toast } = useToast()

    useEffect(() => {
      const down = (e: KeyboardEvent) => {
        if (e.key === 'c' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          if (table.getSelectedRowModel().rows.length > 0) {
            setOpenConfirmDialog(true)
          } else {
            toast({
              title: 'Nenhum ticket selecionado',
              description:
                'Selecione um ticket para confirmar a retirada das pizzas',
            })
          }
        } else if (e.key === 'd' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          if (table.getSelectedRowModel().rows.length > 0) {
            setOpenConfirmWithoutTicketDialog(true)
          } else {
            toast({
              title: 'Nenhum ticket selecionado',
              description:
                'Selecione um ticket para confirmar a retirada das pizzas',
            })
          }
        }
      }

      document.addEventListener('keydown', down)
      return () => document.removeEventListener('keydown', down)
    }, [table, toast])

    const confirmTickets = trpc.confirmTickets.useMutation({
      onSuccess: () => {
        refetch()
        setOpenConfirmDialog(false)
        table.setRowSelection({})
        toast({
          title: 'Tickets confirmados com sucesso',
        })
      },
      onError: (error) => {
        toast({
          title: 'Erro ao confirmar tickets',
          description: error.message,
        })
      },
    })

    const confirmTicketsWithoutTicket =
      trpc.confirmTicketsWithoutTicket.useMutation({
        onSuccess: () => {
          refetch()
          setOpenConfirmWithoutTicketDialog(false)
          table.setRowSelection({})
          toast({
            title: 'Tickets confirmados com sucesso',
          })
        },
        onError: (error) => {
          toast({
            title: 'Erro ao confirmar tickets',
            description: error.message,
          })
        },
      })

    const handleConfirm = () => {
      const selected = table
        .getSelectedRowModel()
        .rows.map((row) => row.original)
        .map((ticket) => ticket.id)

      confirmTickets.mutate(selected)
    }

    const handleConfirmWithoutTicket = (data: {
      name: string
      phone: string
    }) => {
      const selected = table
        .getSelectedRowModel()
        .rows.map((row) => row.original)
        .map((ticket) => ticket.id)

      confirmTicketsWithoutTicket.mutate({
        name: data.name,
        phone: data.phone,
        ticketIds: selected,
      })
    }

    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setOpenConfirmDialog(true)}>
              Profile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog open={openConfirmDialog} onOpenChange={setOpenConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Gostaria de confirmar a retirada das pizzas dos tickets:
              </DialogTitle>
            </DialogHeader>
            <div className="list-disc">
              {table
                .getSelectedRowModel()
                .rows.map((row) => row.original)
                .map((ticket, i) => (
                  <span key={ticket.id}>
                    {ticket.number}
                    {i + 1 !==
                      table
                        .getSelectedRowModel()
                        .rows.map((row) => row.original).length && ' - '}
                  </span>
                ))}
            </div>
            <Button onClick={handleConfirm}>Confirmar</Button>
          </DialogContent>
        </Dialog>
        <Dialog
          open={openConfirmWithoutTicketDialog}
          onOpenChange={setOpenConfirmWithoutTicketDialog}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Gostaria de confirmar a retirada das pizzas sem os tickets:
              </DialogTitle>
            </DialogHeader>
            <div className="list-disc">
              {table
                .getSelectedRowModel()
                .rows.map((row) => row.original)
                .map((ticket, i) => (
                  <span key={ticket.id}>
                    {ticket.number}
                    {i + 1 !==
                      table
                        .getSelectedRowModel()
                        .rows.map((row) => row.original).length && ' - '}
                  </span>
                ))}
            </div>

            <ConfirmFormWithoutTicket onSubmit={handleConfirmWithoutTicket} />
          </DialogContent>
        </Dialog>
      </>
    )
  }
}
