'use client'

import { RouterOutput } from '@pizza/trpc'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

import { tdb } from '@/components/TableDataButton'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Ticket = RouterOutput['getTicketsAfterImport']['tickets'][0]

type ColumnsProps = {
  refetch: () => void
}

export const columns = ({}: ColumnsProps): ColumnDef<Ticket>[] => [ // eslint-disable-line
  tdb('number', 'N'),
  {
    accessorKey: 'createdAt',
    header: 'Criado em',
    cell: ({ getValue }) => {
      const v = getValue<string | null>()
      return <span>{v ? format(new Date(v), 'dd/MM/yyyy HH:mm') : '-'}</span>
    },
  },
  // {
  //   id: 'actions',
  //   enableHiding: false,
  //   cell: ({ row }) => <TicketForm refetch={refetch} ticket={row.original} />,
  // },
]
