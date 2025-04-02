'use client'

import { RouterOutput } from '@pizza/trpc'
import { ColumnDef } from '@tanstack/react-table'

import { tdbNew } from '@/components/table/TableDataButton'
import { tdb } from '@/components/TableDataButton'

import { TicketPaymentForm } from './ticket-payment-form'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Member = RouterOutput['getMembers']['members'][0]
//  & {
//   totalTickets: number
//   totalAmount: number
//   totalPayed: number
//   totalPayedWithCash: number
//   totalPayedWithPix: number
//   total: number // Saldo
// }

type ColumnsProps = {
  refetch: () => void
}

export const columns = ({ refetch }: ColumnsProps): ColumnDef<Member>[] => [
  tdb('visionId', 'Vision', 80),
  tdb('name', 'Nome'),
  // {
  //   accessorKey: 'cleanName',
  //   header: 'Nome',
  //   cell: ({ row }) => {
  //     return <span>{row.original.name}</span>
  //   },
  // },
  // tdb('register', 'Registro'),
  // tdb('session.name', 'Seção'),

  tdb('totalTickets', 'N° Tickets'),
  {
    id: 'calabresa',
    header: 'Calabresa',
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          {row.original.ticketRanges
            .filter((f) => f.start < 1001)
            .map((f, i) => (
              <span key={i}>
                {f.start.toString().padStart(4, '0')}
                {' - '}
                {f.end.toString().padStart(4, '0')}
              </span>
            ))}
        </div>
      )
    },
  },
  {
    id: 'mistas',
    header: 'Mistas',
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          {row.original.ticketRanges
            .filter((f) => f.start > 1999)
            .map((f, i) => (
              <span key={i}>
                {f.start.toString().padStart(4, '0')}
                {' - '}
                {f.end.toString().padStart(4, '0')}
              </span>
            ))}
        </div>
      )
    },
  },

  tdbNew({
    name: 'totalAmount',
    label: 'Valor Total',
    dataType: 'currency',
  }),
  tdbNew({
    name: 'totalPayedWithPix',
    label: 'Pgto Pix',
    dataType: 'currency',
  }),
  tdbNew({
    name: 'totalPayedWithCash',
    label: 'Pgto Dinheiro',
    dataType: 'currency',
  }),
  tdbNew({
    name: 'totalPayed',
    label: 'Pgto Total',
    dataType: 'currency',
  }),
  tdbNew({
    name: 'total',
    label: 'Saldo',
    dataType: 'currency',
  }),

  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => (
      <>
        <TicketPaymentForm
          refetch={refetch}
          memberId={row.original.id}
          ticketsWithoutPayment={row.original.tickets.filter(
            (t) => t.ticketPaymentId === null,
          )}
        />
      </>
    ),
  },
]
