'use client'

import React from 'react'

import { DataTable } from '@/components/data-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { trpc } from '@/lib/trpc/react'

import { columns, Session } from './columns'
import { SessionForm } from './session-form'

type IProps = {
  sessions: Session[]
}

export const SessionsTable: React.FC<IProps> = ({ sessions }) => {
  const { data, refetch } = trpc.getSessions.useQuery()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipes</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns({ refetch })}
          data={data?.sessions || sessions}
          addComponent={<SessionForm refetch={refetch} />}
        />
      </CardContent>
    </Card>
  )
}
