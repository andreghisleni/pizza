'use client'

import Link from 'next/link'
import React from 'react'

import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { trpc } from '@/lib/trpc/react'

import { columns, Ticket } from './columns'
import { TicketForm } from './ticket-form'

type IProps = {
  tickets: Ticket[]
}

export const TicketsTable: React.FC<IProps> = ({ tickets }) => {
  const { data, refetch } = trpc.getTickets.useQuery()
  const { data: membersData } = trpc.getMembers.useQuery()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns({ refetch, members: membersData?.members || [] })}
          data={data?.tickets || tickets}
          addComponent={
            <>
              <Button asChild>
                <Link href="/app/settings/tickets/import">Importar</Link>
              </Button>
              <TicketForm
                refetch={refetch}
                members={membersData?.members || []}
              />
            </>
          }
          initialColumnVisibility={{ cleanName: false }}
        />
      </CardContent>
    </Card>
  )
}
