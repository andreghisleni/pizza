'use client'

import { RouterOutput } from '@pizza/trpc'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { trpc } from '@/lib/trpc/react'

import { ExportButton } from './export-button'

export type Member = RouterOutput['getMembers']['members'][0]

export type Ticket = RouterOutput['getTickets']['tickets'][0]

export default function MyNextJsExcelSheet() {
  const { data: membersData } = trpc.getMembers.useQuery()
  const { data: ticketsData } = trpc.getTickets.useQuery()

  const members = (membersData?.members || []).filter(
    (m) => m.tickets.filter((t) => !t.deliveredAt).length,
  )

  const tickets = (ticketsData?.tickets || []).filter((t) => !t.deliveredAt)

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
          </ul>

          <ExportButton members={members} tickets={tickets} />
        </div>
      </CardContent>
    </Card>
  )
}
