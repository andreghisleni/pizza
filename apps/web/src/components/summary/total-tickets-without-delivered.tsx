import { BarChart } from 'lucide-react'
import { unstable_noStore } from 'next/cache'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { serverClient } from '@/lib/trpc/server'
// import { serverClient } from '@/lib/trpc/server'

export async function TotalTicketWithoutDelivered() {
  unstable_noStore()

  const { totalDeliveredTickets, totalTickets } =
    await serverClient.getTotalTickets()

  const totalToDeliver = totalTickets - totalDeliveredTickets

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">
          Total de ingressos a entregar
        </CardTitle>
        <BarChart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        <span className="text-2xl font-bold">
          {String(totalToDeliver).padStart(4, '0')}
        </span>
        <p className="text-xs text-muted-foreground">
          (Total de ingressos - Total de ingressos entregues)
        </p>
        <p className="text-xs text-muted-foreground">
          ({totalTickets} - {totalDeliveredTickets})
        </p>
      </CardContent>
    </Card>
  )
}
