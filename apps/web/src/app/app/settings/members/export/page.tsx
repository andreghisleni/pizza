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
        <ExportButton members={members} tickets={tickets} />
      </CardContent>
    </Card>
  )
}
