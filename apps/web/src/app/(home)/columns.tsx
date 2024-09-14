'use client'

import { RouterOutput } from '@pizza/trpc'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

import { tdb } from '@/components/TableDataButton'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Ticket = NonNullable<
  RouterOutput['getMemberByRegister']['member']
>['tickets'][0]

export const columns: ColumnDef<Ticket>[] = [
  tdb('number', 'N'),
  {
    accessorKey: 'deliveredAt',
    header: 'Retirado em',
    cell: ({ getValue }) => {
      const v = getValue<string | null>()
      return <span>{v ? format(new Date(v), 'dd/MM/yyyy HH:mm') : '-'}</span>
    },
  },
  {
    accessorKey: 'name',
    header: 'Quem retirou sem ticket',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span>{row.original.name}</span>
        <span className="text-xs text-gray-500">{row.original.phone}</span>
      </div>
    ),
  },
]
