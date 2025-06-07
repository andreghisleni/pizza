'use client'

import React from 'react'
import { useLocalStorage } from 'react-storage-complete'

import { DataTable } from '@/components/data-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { trpc } from '@/lib/trpc/react'

import { columns, Member } from './columns'

type IProps = {
  members: Member[]
}

export const TicketPaymentsTable: React.FC<IProps> = ({ members }) => {
  const { data, refetch } = trpc.getMembers.useQuery()
  // const [name, setName] = useLocalStorage('name')

  const d = data?.members || members

  return (
    <Card>
      <CardHeader>
        <CardTitle>Membros - Pagamentos</CardTitle>
      </CardHeader>
      <CardContent>
        {/* <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /> */}
        <DataTable columns={columns({ refetch })} data={d} />
      </CardContent>
    </Card>
  )
}
