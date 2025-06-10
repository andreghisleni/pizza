'use client'

import { RouterOutput } from '@pizza/trpc'

import { DataTable } from '@/components/data-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { trpc } from '@/lib/trpc/react'

import { PaymentsTable } from './payment-table'
import { ticketsColumns } from './tickets-columns'

export function MemberData({
  member,
}: {
  member: NonNullable<RouterOutput['getMember']['member']>
}) {
  const { data, refetch } = trpc.getMember.useQuery({
    id: member.id,
  })

  const memberData = data?.member || member

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            Dados do membro: {memberData.visionId} - {memberData.name} -{' '}
            {memberData.session.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex w-full gap-4">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={ticketsColumns({ refetch })}
                data={memberData.tickets}
              />
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Pagamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentsTable
                memberId={memberData.id}
                refetchMembers={refetch}
                payments={memberData.ticketPayments}
                toReceive={
                  memberData.tickets.filter((t) => !t.returned).length * 50
                }
              />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
