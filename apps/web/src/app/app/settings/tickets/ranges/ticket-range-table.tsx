'use client'

import React from 'react'

import { DataTable } from '@/components/data-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { trpc } from '@/lib/trpc/react'

import { columns, Member } from './columns'

type IProps = {
  members: Member[]
}

export const TicketRangesTable: React.FC<IProps> = ({ members }) => {
  const { data, refetch } = trpc.getMembers.useQuery()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Membros</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns({ refetch })}
          data={(data?.members || members).map((member) => ({
            ...member,
            totalTickets: member.tickets.length,
            totalTicketsToDeliver: member.tickets.filter(
              (ticket) => !ticket.deliveredAt,
            ).length,
          }))}
        />
      </CardContent>
    </Card>
  )
}
