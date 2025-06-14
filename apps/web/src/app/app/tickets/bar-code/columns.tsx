'use client'

import { RouterOutput } from '@pizza/trpc'
import { ColumnDef } from '@tanstack/react-table'

import { tdbNew } from '@/components/table/TableDataButton'
import { tdb } from '@/components/TableDataButton'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Ticket = RouterOutput['confirmTicket']['ticket']

export const columns: ColumnDef<Ticket>[] = [
  // eslint-disable-line
  tdb('number', 'N'),
  tdb('member.name', 'Name'),
  // {
  //   accessorKey: 'deliveredAt',
  //   header: 'Retirado em',
  //   cell: ({ getValue }) => {
  //     const v = getValue<string | null>()
  //     return <span>{v ? format(new Date(v), 'dd/MM/yyyy HH:mm') : '-'}</span>
  //   },
  // },
  tdbNew({
    name: 'deliveredAt',
    label: 'Retirado em',
    dataType: 'date-time',
  }),
  {
    accessorKey: 'returned',
    header: 'Critica',
    cell: ({ getValue }) => {
      const v = getValue<boolean>()
      return <span>{v ? 'Sim' : 'Não'}</span>
    },
  },

  {
    id: 'cleanName',
    accessorKey: 'member.cleanName',
    header: 'a',
    cell: 'a',
    size: 0,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Quem retirou sem ticket',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span>{row.original.name}</span>
        <span className="text-sm text-gray-500">{row.original.phone}</span>
        <span className="text-xs text-gray-500">
          {row.original.description}
        </span>
      </div>
    ),
  },
]
