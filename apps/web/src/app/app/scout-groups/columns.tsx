'use client'

import { RouterOutput } from '@cepe/trpc'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import Link from 'next/link'

import { FileViewer } from '@/components/file-viewer'
import { tdb } from '@/components/TableDataButton'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { ConfirmInscriptionButton } from './confirm-inscription-button-copy'
import { ConfirmPaymentButton } from './confirm-payment-button'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ScoutGroup = RouterOutput['getScoutGroups']['scoutGroups'][0]

type ColumnsProps = {
  refetch: () => void
}

export const columns = ({ refetch }: ColumnsProps): ColumnDef<ScoutGroup>[] => [
  tdb('name', 'Nome do grupo'),
  tdb('districtName', 'Nome do distrito'),
  tdb('numeral', 'Numeral'),
  tdb('city', 'Cidade'),
  tdb('state', 'Estado'),
  {
    accessorKey: 'responsible',
    header: 'Responsável',
    cell: ({ getValue }) => {
      const responsible = getValue<{
        name: string
        email: string
        phone: string
      }>()
      return (
        <div className="flex flex-col">
          <span>{responsible.name}</span>
          <span>{responsible.email}</span>
          <span>{responsible.phone}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Criado em',
    cell: ({ getValue }) => {
      return (
        <span>{format(new Date(getValue<string>()), 'dd/MM/yyyy HH:mm')}</span>
      )
    },
  },
  {
    accessorKey: 'submitedAt',
    header: 'Submetido em',
    cell: ({ getValue }) => {
      const v = getValue<string>()
      return <span>{v ? format(new Date(v), 'dd/MM/yyyy HH:mm') : '-'}</span>
    },
  },
  {
    accessorKey: 'confirmedAt',
    header: 'Confirmado em',
    cell: ({ getValue, row }) => {
      const v = getValue<string>()

      if (!v)
        return (
          <ConfirmInscriptionButton
            scoutGroupId={row.original.id}
            refetch={refetch}
          />
        )
      return <span>{v ? format(new Date(v), 'dd/MM/yyyy HH:mm') : '-'}</span>
    },
  },
  {
    accessorKey: 'paymentConfirmedAt',
    header: 'Pag Confirmado em',
    cell: ({ getValue, row }) => {
      const v = getValue<string>()
      if (!v)
        return (
          <ConfirmPaymentButton
            scoutGroupId={row.original.id}
            refetch={refetch}
          />
        )
      return <span>{v ? format(new Date(v), 'dd/MM/yyyy HH:mm') : '-'}</span>
    },
  },
  {
    id: 'recipient_photo',
    enableHiding: false,

    cell: ({ row }) => {
      const { id, receipt_file } = row.original

      if (!receipt_file)
        return (
          <Button variant="outline" disabled>
            Não há arquivo
          </Button>
        )

      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button>Arquivo</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Comprovante de pagamento</DialogTitle>
            </DialogHeader>
            <div className="h-[600px]">
              <FileViewer
                url={`/scout-group/download/${id}/file`}
                file_name={receipt_file}
                name={'Comprovante de pagamento'}
              />
            </div>
          </DialogContent>
        </Dialog>
      )
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => (
      <>
        <Button variant="outline" asChild>
          <Link href={`/app/scout-groups/${row.original.id}`}>Ver</Link>
        </Button>
      </>
    ),
  },
]
