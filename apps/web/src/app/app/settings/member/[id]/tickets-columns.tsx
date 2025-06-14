'use client'

import { RouterOutput } from '@pizza/trpc'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

import { tdbNew } from '@/components/table/TableDataButton'
import { tdb } from '@/components/TableDataButton'

import { ToggleReturnedTicketButton } from './toggle-returned-ticket'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Ticket = NonNullable<
  RouterOutput['getMember']['member']
>['tickets'][0]

type ColumnsProps = {
  refetch: () => void
}

export const ticketsColumns = ({
  refetch,
}: ColumnsProps): ColumnDef<Ticket>[] => [
  tdb('number', 'N'),
  {
    accessorKey: 'returned',
    header: 'Devolvidos',
    cell: ({ row }) => {
      return <span>{row.getValue('returned') ? 'Sim' : 'Não'}</span>
    },
  },
  tdbNew({
    name: 'deliveredAt',
    label: 'Retirado em',
    dataType: 'date-time',
  }),
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
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => (
      <ToggleReturnedTicketButton
        ticketId={row.original.id}
        refetch={refetch}
        isReturnedTicket={row.original.returned}
      />
    ),
  },
]
