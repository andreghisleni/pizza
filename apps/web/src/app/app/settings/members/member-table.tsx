'use client'

import Link from 'next/link'
import React from 'react'

import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { trpc } from '@/lib/trpc/react'

import { columns, Member } from './columns'
import { MemberForm } from './member-form'

type IProps = {
  members: Member[]
}

export const MembersTable: React.FC<IProps> = ({ members }) => {
  const { data, refetch } = trpc.getMembers.useQuery()
  const { data: sessionsData } = trpc.getSessions.useQuery()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Membros</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns({ refetch, sessions: sessionsData?.sessions || [] })}
          data={(data?.members || members).map((member) => ({
            ...member,
            totalTickets: member.tickets.length,
            totalTicketsToDeliver: member.tickets.filter(
              (ticket) => !ticket.deliveredAt,
            ).length,
          }))}
          addComponent={
            <>
              <Button asChild>
                <Link href="/app/settings/members/import">Adicionar</Link>
              </Button>
              <MemberForm
                refetch={refetch}
                sessions={sessionsData?.sessions || []}
              />
            </>
          }
        />
      </CardContent>
    </Card>
  )
}
