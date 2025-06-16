'use client'

import { RouterOutput } from '@pizza/trpc'

import { DataTable } from '@/components/data-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { trpc } from '@/lib/trpc/react'
import { agruparNumbers } from '@/utils/agrupar-numaros'

import { columns } from './columns'
import { ExportButton } from './export-button'

export type Member = RouterOutput['getMembers']['members'][0]

export type Ticket = RouterOutput['getTickets']['tickets'][0]

export default function MyNextJsExcelSheet() {
  const { data: membersData } = trpc.getMembers.useQuery()
  const { data: ticketsData } = trpc.getTickets.useQuery()

  const members = (membersData?.members || []).filter(
    (m) => m.tickets.filter((t) => !t.deliveredAt && !t.returned).length,
  )

  const tickets = (ticketsData?.tickets || []).filter(
    (t) => !t.deliveredAt && !t.returned,
  )

  const ticketsWithCritica = (ticketsData?.tickets || []).filter(
    (t) => t.returned && t.deliveredAt,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exportar ingressos não vendidos</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between gap-16">
        <div className="min-w-96">
          <ul>
            <li>
              <span>Total de membros com tickets para retirar: </span>{' '}
              {members.length}
            </li>
            <li>
              <span>Total de tickets para retirar: </span> {tickets.length}
            </li>
            <li>
              <span>Total de tickets com crítica: </span>{' '}
              {ticketsWithCritica.length}
            </li>
          </ul>

          <ExportButton
            members={members}
            tickets={tickets}
            ticketsWithCritica={ticketsWithCritica}
          />
        </div>
        <div>
          <DataTable
            columns={columns}
            data={members.map((member) => ({
              visionId: member.visionId || 'Sem VisionId',
              name: member.name,
              session: member.session,
              totalTickets: member.tickets.length,
              numbers: agruparNumbers(member.tickets.map((t) => t.number)),
              ticketsARetirar: member.tickets.filter(
                (t) => !t.deliveredAt && !t.returned,
              ).length,
              ticketsARetirarCalabresa: member.tickets.filter(
                (t) => !t.deliveredAt && !t.returned && t.number <= 1000,
              ).length,
              ticketsARetirarMista: member.tickets.filter(
                (t) => !t.deliveredAt && !t.returned && t.number >= 2000,
              ).length,
            }))}
          />
        </div>
      </CardContent>
    </Card>
  )
}
