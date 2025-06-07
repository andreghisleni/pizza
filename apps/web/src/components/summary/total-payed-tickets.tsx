import { BarChart } from 'lucide-react'
import { unstable_noStore } from 'next/cache'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { serverClient } from '@/lib/trpc/server'
// import { serverClient } from '@/lib/trpc/server'

export async function TotalPayedTicket() {
  unstable_noStore()

  const {
    totalPayedTickets,
    totalPayedTicketsOnLastWeek,
    totalCalabresaPayed,
    totalMistaPayed,
  } = await serverClient.getTotalTicketPayments()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">
          Total de ingressos pagos
        </CardTitle>
        <BarChart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        <span className="text-2xl font-bold">
          {String(totalPayedTickets).padStart(4, '0')}
        </span>
        <p className="text-xs text-muted-foreground">
          + {totalPayedTicketsOnLastWeek} nos últimos 7 dias
        </p>
        <p className="text-xs text-muted-foreground">
          Calabresa: {String(totalCalabresaPayed).padStart(4, '0')}
        </p>
        <p className="text-xs text-muted-foreground">
          Mista: {String(totalMistaPayed).padStart(4, '0')}
        </p>
      </CardContent>
    </Card>
  )
}
