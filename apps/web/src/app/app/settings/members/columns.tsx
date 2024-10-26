'use client'

import { RouterOutput } from '@pizza/trpc'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

import { DataTable } from '@/components/data-table'
import { tableDataButton, tdb } from '@/components/TableDataButton'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { agruparNumbers } from '@/utils/agrupar-numaros'

import { columnsTickets } from './columns-tickets'
import { MemberForm, Session } from './member-form'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Member = RouterOutput['getMembers']['members'][0]

type ColumnsProps = {
  refetch: () => void
  sessions: Session[]
}

export const columns = ({
  refetch,
  sessions,
}: ColumnsProps): ColumnDef<Member>[] => [
  tdb('visionId', 'Vision'),
  tdb('name', 'Nome'),
  // {
  //   accessorKey: 'cleanName',
  //   header: 'Nome',
  //   cell: ({ row }) => {
  //     return <span>{row.original.name}</span>
  //   },
  // },
  tdb('register', 'Registro'),
  tdb('session.name', 'Seção'),
  {
    accessorKey: 'createdAt',
    header: 'Criado em',
    cell: ({ row }) => {
      return (
        <span>
          {format(new Date(row.getValue('createdAt')), 'dd/MM/yyyy HH:mm')}
        </span>
      )
    },
  },
  // tdb('tickets', 'N° Tickets'),
  {
    id: 'tickets',
    header: tableDataButton('N° Tickets'),
    cell: ({ row }) => {
      return <span>{row.original.tickets.length}</span>
    },
  },
  {
    id: 'faixas',
    header: 'Números',
    cell: ({ row }) => {
      const numeros = row.original.tickets.map((ticket) => ticket.number)

      const faixa = agruparNumbers(numeros)
      return (
        <div className="flex flex-col">
          {faixa.map((f, i) => (
            <span key={i}>{f}</span>
          ))}
        </div>
      )
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => (
      <>
        <MemberForm
          refetch={refetch}
          member={row.original}
          sessions={sessions}
        />

        <Dialog>
          <DialogTrigger asChild>
            <Button>Tickets</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tickets: {row.original.name}</DialogTitle>
            </DialogHeader>
            <DataTable
              columns={columnsTickets}
              data={row.original.tickets}
              initialColumnVisibility={{ cleanName: false }}
            />
          </DialogContent>
        </Dialog>
      </>
    ),
  },
  // { accessorKey: 'cleanName', header: 'N', size: 0 },
]
