'use client'

import React from 'react'

import { DataTable } from '@/components/data-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { trpc } from '@/lib/trpc/react'

import { columns, Ticket } from './columns'
import { ticketActions } from './ticket-actions'

type IProps = {
  tickets: Ticket[]
}

export const TicketsTable: React.FC<IProps> = ({ tickets }) => {
  const { data, refetch } = trpc.getTickets.useQuery()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns({ refetch })}
          data={data?.tickets || tickets}
          // addComponent={<TicketForm refetch={refetch} />}
          actionComponent={ticketActions({ refetch })}
          actionDisabledFunction={({ row }) => !!row.original.deliveredAt}
          initialColumnVisibility={{ cleanName: false }}
        />
      </CardContent>
    </Card>
  )
}
