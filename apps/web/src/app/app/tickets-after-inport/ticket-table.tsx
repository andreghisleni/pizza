'use client'

import React from 'react'

import { DataTable } from '@/components/data-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { trpc } from '@/lib/trpc/react'

import { columns, Ticket } from './columns'

type IProps = {
  tickets: Ticket[]
}

export const TicketsTable: React.FC<IProps> = ({ tickets }) => {
  const { data, refetch } = trpc.getTicketsAfterImport.useQuery()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets adicionados depois da importação</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns({ refetch })}
          data={data?.tickets || tickets}
          // addComponent={<TicketForm refetch={refetch} />}
        />
      </CardContent>
    </Card>
  )
}
