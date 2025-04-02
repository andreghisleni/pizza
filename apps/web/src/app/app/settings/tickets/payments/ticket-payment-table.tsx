'use client'

import React from 'react'

import { DataTable } from '@/components/data-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { trpc } from '@/lib/trpc/react'

import { columns, Member } from './columns'

type IProps = {
  members: Member[]
}

export const TicketPaymentsTable: React.FC<IProps> = ({ members }) => {
  const { data, refetch } = trpc.getMembers.useQuery()

  const d = data?.members || members

  return (
    <Card>
      <CardHeader>
        <CardTitle>Membros - Pagamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns({ refetch })} data={d} />
      </CardContent>
    </Card>
  )
}
